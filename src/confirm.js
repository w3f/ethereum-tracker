const web3 = require("./web3")
const { transactionCount } = require("./lib/prometheus.js")
const cfg = require("../config/main.json")

async function getConfirmations(txHash) {
  try {
    // Get transaction details
    const trx = await web3.eth.getTransaction(txHash)

    // Get current block number
    const currentBlock = await web3.eth.getBlockNumber()

    // When transaction is unconfirmed, its block number is null.
    // In this case we return 0 as number of confirmations
    return trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber
  } catch (error) {
    console.log(error)
  }
}

function confirmEtherTransaction(txHash, confirmations = 1) {
  setTimeout(async () => {
    // Get current number of confirmations and compare it with sought-for value
    const trxConfirmations = await getConfirmations(txHash)
    console.log(
      "Transaction with hash " +
        txHash +
        " has " +
        trxConfirmations +
        " confirmation(s)"
    )

    // Get transaction details
    const trx = await web3.eth.getTransaction(txHash)
    if (!cfg.addresses.includes(trx.from)) {
      console.log(
        "The address is not inside in the monitoring list: ",
        trx.from
      )
      return
    }

    if (trxConfirmations >= confirmations) {
      console.log("############# BINGO ############# :", trx.from)
      transactionCount.set({ from: trx.from }, trx.nonce)
      console.log(
        "Transaction with hash " + txHash + " has been successfully confirmed"
      )
      console.log("Data has been recorded to the prometheus.")
      return
    }
    // Recursive call
    return confirmEtherTransaction(txHash, confirmations)
  }, 30 * 1000)
}

module.exports = confirmEtherTransaction
