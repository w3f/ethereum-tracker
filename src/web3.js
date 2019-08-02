const Web3 = require('web3')

// Instantiate web3 with WebSocketProvider
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.INFURA_WS_URL))

module.exports = web3