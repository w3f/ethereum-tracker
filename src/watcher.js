const confirmEtherTransaction = require("./confirm")
const TOKEN_ABI = require("./abi/dot")
const CLAIM_ABI = require("./abi/claim")
const cfg = require("../config/main.json")
const web3 = require("./web3")
const { amountTransfer } = require("./lib/prometheus.js")

function watchTokenContractEvent() {
  console.log(
    "################ watchTokenContractEvent is listening..... #############"
  )
  // Instantiate token contract object with JSON ABI and address
  const tokenContract = new web3.eth.Contract(
    TOKEN_ABI,
    cfg.contracts.token,
    error => {
      if (error) console.log(error)
    }
  )

  // Generate filter options
  const options = {
    filter: {
      from: cfg.addresses
    },
    fromBlock: "latest"
  }

  // Subscribe to Transfer events matching filter criteria
  tokenContract.events.Transfer(options, async (error, result) => {
    if (error) {
      console.log(error)
      return
    }
    console.log("DOT contract transfer event is being detected.")
    const { from, to, value } = result.returnValues
    amountTransfer.observe({ from, to }, parseFloat(value) / 1000)
    // console.log("DOT contract transfer oberserved :", result.returnValues)

    confirmEtherTransaction(result.transactionHash)
    return
  })
}

function watchClaimContractEvent() {
  console.log(
    "################ watchClaimContractEvent is listening..... #############"
  )
  // Instantiate token contract object with JSON ABI and address
  const claimContract = new web3.eth.Contract(
    CLAIM_ABI,
    cfg.contracts.claims,
    error => {
      if (error) console.log(error)
    }
  )

  claimContract.events.allEvents(
    {
      topics: [
        // Amended, Vested, NewOwner, InjectedSaleAmount, VestedIncreased
        [
          "0x385f6a4b73038a5f14e3482732f99dde086b6fd0930af57604250b72726f4392",
          "0x00d5958799b183a7b738d3ad5e711305293dd5076a37a4e3b7e6611dea6114f3",
          "0x70aea8d848e8a90fb7661b227dc522eb6395c3dac71b63cb59edd5c9899b2364",
          "0x572e24c41e0a8fb122e74d5ae46960a12d21bc621ae05d27b56958e46dab916c",
          "0xddd46b2454e8e8195e43bab9d77da6c175cf57feab9936752d696f980bd22f5c"
        ]
      ]
    },
    (error, result) => {
      if (!error) {
        console.log("CLAIMS contract event is being detected.")
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
