require("./env")
const watcher = require("./watcher")
const prometheus = require("./lib/prometheus")
const express = require("express")

const app = express()
const port = 3000

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
