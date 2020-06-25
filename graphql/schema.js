const { buildSchema } = require('graphql')

module.exports = buildSchema(`

	input UserInputData {
		email: String!
		name: String!
		password: String!
	}

	input MenuInputData {
		name: String!
		items: [SubMenuInputData!]!
	}

	input SubMenuInputData {
		name: String!
		items: [DishInputData!]!
	}

	input DishInputData {
		name: String!
		description: String
		price: Int!
	}


	type User {
		_id: ID!
		name: String!
		email: String!
		password: String
	}

	type Menu {
		_id: ID!
		name: String!
		items: [SubMenu!]!
	}

	type SubMenu {
		_id: ID!
		name: String!
		items: [Dish!]!
	}

	type Dish {
		_id: ID!
		name: String!
		description: String
		price: Int!
	}

	type Dishes {
		items: [Dish!]!
		count: Int!
	}
	

	type RootQuery {
		dishes(page: Int): Dishes!
	}

	type RootMutation {
		createUser(data: UserInputData): User!
		createDish(data: DishInputData): Dish!
		createMenu(data: MenuInputData): Menu!
		createSubMenu(data: SubMenuInputData): SubMenu!
	}


	schema {
		query: RootQuery
		mutation: RootMutation
	}

`)
