const confirmEtherTransaction = require("./confirm")
const TOKEN_ABI = require("./abi/dot")
const CLAIM_ABI = require("./abi/claim")
const accountList = require("./address.json")
const web3 = require("./web3")

const { amountTransfer } = require("./lib/prometheus.js")

function watchTokenContractEvent() {
  // Instantiate token contract object with JSON ABI and address
  const tokenContract = new web3.eth.Contract(
    TOKEN_ABI,
    process.env.TOKEN_CONTRACT_ADDRESS,
    error => {
      if (error) console.log(error)
    }
  )

  // Generate filter options
  const options = {
    filter: {
      from: accountList
    },
    fromBlock: "latest"
  }

  // Subscribe to Transfer events matching filter criteria
  tokenContract.events.Transfer(options, async (error, result) => {
    if (error) {
      console.log(error)
      return
    }
    const { from, to, value } = result.returnValues
    amountTransfer.observe({ from, to }, parseFloat(value) / 1000)

    console.log("Transaction hash is: ", result.transactionHash)
    confirmEtherTransaction(result.transactionHash)
    return
  })
}

function watchClaimContractEvent() {
  // Instantiate token contract object with JSON ABI and address
  const claimContract = new web3.eth.Contract(
    CLAIM_ABI,
    process.env.CLAIM_CONTRACT_ADDRESS,
    error => {
      if (error) console.log(error)
    }
  )

  claimContract.events.allEvents(
    {
      topics: [
        // Amended, Vested, NewOwner
        [
          "0x385f6a4b73038a5f14e3482732f99dde086b6fd0930af57604250b72726f4392",
          "0x00d5958799b183a7b738d3ad5e711305293dd5076a37a4e3b7e6611dea6114f3",
          "0x70aea8d848e8a90fb7661b227dc522eb6395c3dac71b63cb59edd5c9899b2364"
        ]
      ]
    },
    (error, result) => {
      if (!error) {
        confirmEtherTransaction(result.transactionHash)
      } else {
        console.log(error)
      }
    }
  )
}

module.exports = {
  watchTokenContractEvent,
  watchClaimContractEvent
}
