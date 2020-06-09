const { buildSchema } = require('graphql')

module.exports = buildSchema(`
	type 
	
	input InputData {
		userId: Int!
		ingredients: [String!]!
	}

	type RootMutation {
		createOrder(userInput: InputData)
	}

	type RootQuery {
		ingredients: [String!]!
	}

	schema {
		query: RootQuery
		mutation: RootMutation
	}
`)
