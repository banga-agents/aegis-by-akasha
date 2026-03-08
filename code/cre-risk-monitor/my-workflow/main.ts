import {
  bytesToHex,
  ConsensusAggregationByFields,
  type CronPayload,
  cre,
  getNetwork,
  type HTTPSendRequester,
  LAST_FINALIZED_BLOCK_NUMBER,
  median,
  Runner,
  type Runtime,
  TxStatus,
  encodeCallMsg,
  hexToBase64,
} from '@chainlink/cre-sdk'
import { type Address, decodeFunctionResult, encodeFunctionData, parseUnits, zeroAddress } from 'viem'
import { sha256, stringToHex } from 'viem'
import { z } from 'zod'
import { IERC20, ReserveManager } from '../contracts/abi'

const configSchema = z.object({
  workflowId: z.string(),
  schedule: z.string(),
  sourceUrl: z.string(),
  fallbackChangePct: z.number().optional(),
  fixedMetric: z.number().optional(),
  fixedTimestamp: z.string().optional(),
  thresholdPct: z.number(),
  evms: z.array(
    z.object({
      tokenAddress: z.string(),
      proxyAddress: z.string(),
      chainSelectorName: z.string(),
      gasLimit: z.string(),
    }),
  ),
})

type Config = z.infer<typeof configSchema>

type MarketResponse = {
  bitcoin?: {
    usd?: number
    usd_24h_change?: number
  }
}

type RiskDecision = {
  source: string
  timestamp: string
  metric: number
  threshold: number
  level: 'low' | 'medium' | 'high'
  rationale: string
  confidence: number
}

const safeJsonStringify = (obj: unknown): string =>
  JSON.stringify(obj, (_, value) => (typeof value === 'bigint' ? value.toString() : value), 2)

const readMarketChange = (sendRequester: HTTPSendRequester, config: Config): { value: number } => {
  if (typeof config.fixedMetric === 'number') {
    return { value: config.fixedMetric }
  }

  try {
    const response = sendRequester.sendRequest({ method: 'GET', url: config.sourceUrl }).result()
    if (response.statusCode !== 200) {
      throw new Error(`HTTP status ${response.statusCode}`)
    }

    const text = Buffer.from(response.body).toString('utf-8')
    const data: MarketResponse = JSON.parse(text)
    const change = data.bitcoin?.usd_24h_change
    if (typeof change !== 'number' || Number.isNaN(change)) {
      throw new Error('Missing bitcoin.usd_24h_change in response')
    }
    return { value: change }
  } catch (error) {
    if (typeof config.fallbackChangePct === 'number') {
      return { value: config.fallbackChangePct }
    }
    const msg = error instanceof Error ? error.message : String(error)
    throw new Error(`Market ingest failed with no fallback: ${msg}`)
  }
}

const classifyRisk = (metric: number, threshold: number): RiskDecision['level'] => {
  const abs = Math.abs(metric)
  if (abs >= threshold * 2) return 'high'
  if (abs >= threshold) return 'medium'
  return 'low'
}

const buildRiskDecision = (config: Config, metric: number): RiskDecision => {
  const level = classifyRisk(metric, config.thresholdPct)
  const rationale = `24h BTC change=${metric.toFixed(4)} threshold=${config.thresholdPct.toFixed(4)}`
  const confidence = 0.88
  const timestamp = config.fixedTimestamp || new Date().toISOString()

  return {
    source: config.sourceUrl,
    timestamp,
    metric,
    threshold: config.thresholdPct,
    level,
    rationale,
    confidence,
  }
}

const computeEventHash = (workflowId: string, decision: RiskDecision): string => {
  const payload = JSON.stringify({ workflowId, decision })
  return sha256(stringToHex(payload))
}

const getTotalSupply = (runtime: Runtime<Config>): bigint => {
  const evmConfig = runtime.config.evms[0]
  const network = getNetwork({
    chainFamily: 'evm',
    chainSelectorName: evmConfig.chainSelectorName,
    isTestnet: true,
  })

  if (!network) {
    throw new Error(`Network not found for ${evmConfig.chainSelectorName}`)
  }

  const evmClient = new cre.capabilities.EVMClient(network.chainSelector.selector)
  const callData = encodeFunctionData({ abi: IERC20, functionName: 'totalSupply' })

  const contractCall = evmClient
    .callContract(runtime, {
      call: encodeCallMsg({
        from: zeroAddress,
        to: evmConfig.tokenAddress as Address,
        data: callData,
      }),
      blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
    })
    .result()

  return decodeFunctionResult({
    abi: IERC20,
    functionName: 'totalSupply',
    data: bytesToHex(contractCall.data),
  })
}

const writeAnchor = (
  runtime: Runtime<Config>,
  totalMinted: bigint,
  totalReserveScaled: bigint,
): string => {
  const evmConfig = runtime.config.evms[0]
  const network = getNetwork({
    chainFamily: 'evm',
    chainSelectorName: evmConfig.chainSelectorName,
    isTestnet: true,
  })

  if (!network) {
    throw new Error(`Network not found for ${evmConfig.chainSelectorName}`)
  }

  const evmClient = new cre.capabilities.EVMClient(network.chainSelector.selector)

  const callData = encodeFunctionData({
    abi: ReserveManager,
    functionName: 'updateReserves',
    args: [{ totalMinted, totalReserve: totalReserveScaled }],
  })

  const reportResponse = runtime
    .report({
      encodedPayload: hexToBase64(callData),
      encoderName: 'evm',
      signingAlgo: 'ecdsa',
      hashingAlgo: 'keccak256',
    })
    .result()

  const attemptWrite = () =>
    evmClient
      .writeReport(runtime, {
        receiver: evmConfig.proxyAddress,
        report: reportResponse,
        gasConfig: { gasLimit: evmConfig.gasLimit },
      })
      .result()

  let resp = attemptWrite()
  if (resp.txStatus !== TxStatus.SUCCESS) {
    runtime.log(`writeReport retrying after status=${resp.txStatus} err=${resp.errorMessage || 'n/a'}`)
    resp = attemptWrite()
  }

  if (resp.txStatus !== TxStatus.SUCCESS) {
    throw new Error(`writeReport failed after retry: ${resp.errorMessage || resp.txStatus}`)
  }

  return bytesToHex(resp.txHash || new Uint8Array(32))
}

const onCronTrigger = (runtime: Runtime<Config>, payload: CronPayload): string => {
  if (!payload.scheduledExecutionTime) {
    throw new Error('Scheduled execution time is required')
  }

  const httpClient = new cre.capabilities.HTTPClient()
  const market = httpClient
    .sendRequest(
      runtime,
      readMarketChange,
      ConsensusAggregationByFields<{ value: number }>({
        value: median,
      }),
    )(runtime.config)
    .result()
  const metric = market.value

  const decision = buildRiskDecision(runtime.config, metric)
  const eventHash = computeEventHash(runtime.config.workflowId, decision)

  runtime.log(`risk_decision=${safeJsonStringify(decision)}`)
  runtime.log(`event_hash=${eventHash}`)

  const totalSupply = getTotalSupply(runtime)
  const reserveScalar = Math.round(Math.abs(decision.metric) * 1_000_000)
  const totalReserveScaled = parseUnits(String(reserveScalar), 12)

  const txHash = writeAnchor(runtime, totalSupply, totalReserveScaled)
  runtime.log(`tx_hash=${txHash}`)

  return safeJsonStringify({
    workflowId: runtime.config.workflowId,
    decision,
    eventHash,
    txHash,
  })
}

const initWorkflow = (config: Config) => {
  const cronTrigger = new cre.capabilities.CronCapability()
  return [
    cre.handler(
      cronTrigger.trigger({ schedule: config.schedule }),
      onCronTrigger,
    ),
  ]
}

export async function main() {
  const runner = await Runner.newRunner<Config>({ configSchema })
  await runner.run(initWorkflow)
}

main()
