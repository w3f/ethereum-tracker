const Web3 = require("web3")

const cfg = require("../config/main.json")

// Instantiate web3 with WebSocketProvider
const web3 = new Web3(new Web3.providers.WebsocketProvider(cfg.infuraURL))

module.exports = web3
