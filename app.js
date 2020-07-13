
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE')
	res.setHeader('Access-Control-Allow-Headers', 'Content-type')

	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next()
})

app.use('/graphql', graphqlHttp({
	schema: graphqlSchema,
	rootValue: graphqlResolver,
	graphiql: true,
	customFormatErrorFn(err) {
		if (!err.originalError) {
			return err
		}
		const { data, code = 500 } = err.originalError
		const { message = 'An error occurred.' } = err
		return { message, status: code, data }
	}
}))

app.use((error, req, res, next) => {
	console.log(error);
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status).json({ message: message, data: data });
});

mongoose
	.connect(
		'mongodb+srv://andrea:gattoMongo666@cluster0-06ywg.mongodb.net/menu',
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(_ => {
		app.listen(8080);
	})
	.catch(err => console.log(err));