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

  app.listen(port, () =>
    console.log(`Transaction Watcher listening on port ${port}`)
  )
}

start()
