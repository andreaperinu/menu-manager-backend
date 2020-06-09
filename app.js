
const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE')
	res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization')

	req.method === 'OPTIONS' && res.sendStatus(200)
	next()
})

app.use('/graphql', graphqlHttp({
	schema: graphqlSchema,
	rootValue: graphqlResolver
}))

app.listen(8080)
