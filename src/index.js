const watcher = require("./watcher")
const prometheus = require("./lib/prometheus")
const express = require("express")
const cfg = require("../config/main.json")

const app = express()
const port = cfg.port

async function start() {
  prometheus.injectMetricsRoute(app)
  prometheus.startCollection()

  watcher.watchTokenContractEvent()
  watcher.watchClaimContractEvent()

  prometheus.transactionCount.set({ from: cfg.contracts.token }, -1)
  prometheus.transactionCount.set({ from: cfg.contracts.claims }, -1)

  app.listen(port, () =>
    console.log(`Transaction Watcher listening on port ${port}`)
  )
}

start()
