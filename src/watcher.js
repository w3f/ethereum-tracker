const confirmEtherTransaction = require('./confirm')
const TOKEN_ABI = require('./abi/dot')
const CLAIM_ABI = require('./abi/claim')
const accountList = require('./address.json')
const web3 = require('./web3')

const {
  amountTransfer
} = require('./lib/prometheus.js')


function watchTokenContractEvent() {
  // Instantiate token contract object with JSON ABI and address
  const tokenContract = new web3.eth.Contract(
    TOKEN_ABI, process.env.TOKEN_CONTRACT_ADDRESS,
    (error, result) => { if (error) console.log(error) }
  )

  // Generate filter options
  const options = {
    filter: {
      from:  accountList,
    },
    fromBlock: 'latest'
  }

  // Subscribe to Transfer events matching filter criteria
  tokenContract.events.Transfer(options, async (error, result) => {
    if (error) {
      console.log(error)
      return
    }
    const { from, to, value  } = result.returnValues 
    amountTransfer.observe( { from, to }, parseFloat(value)  / 1000)

    console.log('Transaction hash is: ', result.transactionHash)      
    // Initiate transaction confirmation
    confirmEtherTransaction(result.transactionHash)
    return
  })
}

function watchClaimContractEvent() {
    // Instantiate token contract object with JSON ABI and address
    const claimContract = new web3.eth.Contract(
      CLAIM_ABI, process.env.CLAIM_CONTRACT_ADDRESS,
      (error, result) => { if (error) console.log(error) }
    )

    claimContract.events.Claimed(async (error, result) => {
      // console.log('Claimed event :', result)
      // Initiate transaction confirmation
      confirmEtherTransaction(result.transactionHash)

      if (error) {
        console.log(error)
        return
      }
      return
    })

    claimContract.events.Amended(async (error, result) => {
      // console.log('Amended event :', result)
      // Initiate transaction confirmation
      confirmEtherTransaction(result.transactionHash)

      if (error) {
        console.log(error)
        return
      }
      return
    })

    claimContract.events.Vested(async (error, result) => {
      // console.log('Vested event :', result)
      // Initiate transaction confirmation
      confirmEtherTransaction(result.transactionHash)

      if (error) {
        console.log(error)
        return
      }
      return
    })

    claimContract.events.NewOwner(async (error, result) => {
      // console.log('NewOwner event :', result)
      // Initiate transaction confirmation
      confirmEtherTransaction(result.transactionHash)

      if (error) {
        console.log(error)
        return
      }
      return
    })
}

module.exports = {
  watchTokenContractEvent,
  watchClaimContractEvent
}