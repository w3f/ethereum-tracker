const Web3 = require('web3')
const confirmEtherTransaction = require('./confirm')
const TOKEN_ABI = require('./abi')
const CLAIM_ABI = require('./claimABI')

const accountList = require('./address.json')


function watchEtherTransfers() {
  // Instantiate web3 with WebSocket provider
  const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.INFURA_WS_URL))

  // Instantiate subscription object
  const subscription = web3.eth.subscribe('pendingTransactions')

  // Subscribe to pending transactions
  subscription.subscribe((error, result) => {
    if (error) console.log(error)
  })
    .on('data', async (txHash) => {
      try {
        // Instantiate web3 with HttpProvider
        const web3Http = new Web3(process.env.INFURA_URL)

        // Get transaction details
        const trx = await web3Http.eth.getTransaction(txHash)

        // console.log('Found incoming Ether transaction from ' + process.env.WALLET_FROM + ' to ' + process.env.WALLET_TO);
        console.log('Transaction value is: ' + process.env.AMOUNT)
        console.log('Transaction hash is: ' + txHash + '\n')

        // Initiate transaction confirmation
        confirmEtherTransaction(txHash)

        // Unsubscribe from pending transactions.
        subscription.unsubscribe()
      }
      catch (error) {
        console.log(error)
      }
    })
}


// Generate filter options
const options = {
  filter: {
    _from:  accountList,
  },
  fromBlock: 'latest'
}


function watchTokenContractEvent() {
  // Instantiate web3 with WebSocketProvider
  const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.INFURA_WS_URL))

  // Instantiate token contract object with JSON ABI and address
  const tokenContract = new web3.eth.Contract(
    TOKEN_ABI, process.env.TOKEN_CONTRACT_ADDRESS,
    (error, result) => { if (error) console.log(error) }
  )

  // Subscribe to Transfer events matching filter criteria
  tokenContract.events.Transfer(options, async (error, result) => {
    console.log('Transfer result :', result)
    if (error) {
      console.log(error)
      return
    }

    const action = result.event
    const { _from, _to, _value } = result.returnValues

    // console.log('Found incoming Pluton transaction from ' + process.env.WALLET_FROM + ' to ' + process.env.WALLET_TO + '\n');
    // console.log('Transaction value is: ' + process.env.AMOUNT)
    console.log('Transaction hash is: ' + result.transactionHash + '\n')

    // Initiate transaction confirmation
    // confirmEtherTransaction(result.transactionHash)
    return
  })
}

function watchClaimContractEvent() {
    // Instantiate web3 with WebSocketProvider
    const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.INFURA_WS_URL))

    // Instantiate token contract object with JSON ABI and address
    const claimContract = new web3.eth.Contract(
      CLAIM_ABI, process.env.TOKEN_CONTRACT_ADDRESS,
      (error, result) => { if (error) console.log(error) }
    )

    claimContract.events.Amended(options, async (error, event) => {
      console.log('Amended event :', event)
      if (error) {
        console.log(error)
        return
      }
      return
    })

    claimContract.events.Claimed(options, async (error, event) => {
      console.log('Claimed event :', event)
      if (error) {
        console.log(error)
        return
      }
      return
    })

    claimContract.events.IndexAssigned(options, async (error, event) => {
      console.log('IndexAssigned event :', event)
      if (error) {
        console.log(error)
        return
      }
      return
    })

    claimContract.events.Vested(options, async (error, event) => {
      console.log('Vested event :', event)
      if (error) {
        console.log(error)
        return
      }
      return
    })

    claimContract.events.NewOwner(options, async (error, event) => {
      console.log('NewOwner event :', event)
      if (error) {
        console.log(error)
        return
      }
      return
    })

}

module.exports = {
  watchEtherTransfers,
  watchTokenContractEvent,
  watchClaimContractEvent
}