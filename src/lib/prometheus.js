const { register } = require('prom-client')
const promClient = require('prom-client')

module.exports = {
	startCollection: () => {
		console.log(
			'Starting the collection of metrics, the metrics are available on /metrics'
		)
		promClient.collectDefaultMetrics()
	},

	injectMetricsRoute: app => {
		app.get('/metrics', (req, res) => {
			res.set('Content-Type', register.contentType)
			res.end(register.metrics())
		})
	},

    amountTransfer: new promClient.Histogram({
        name: 'polkadot_transferred_amount',
        help: 'Number of tokens have been moved',
        labelNames: ['from', 'to']
	}),
	
	transactionCount: new promClient.Gauge({
		name: 'polkadot_transaction_count',
		help: 'Number of transactions have been called',
		labelNames: ['from']
	})
}
