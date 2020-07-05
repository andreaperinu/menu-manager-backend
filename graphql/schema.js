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

	type Menus {
		items: [Menu!]!
		count: Int!
	}
	
	type RootQuery {
		dish(id: ID!): Dish!
		dishes(page: Int): Dishes
		menu(id: ID!): Menu!
		menus(page: Int): Menus
	}

	type RootMutation {
		createUser(data: UserInputData): User!
		createDish(data: DishInputData): Dish!
		deleteDish(id: ID!): Boolean
		deleteDishes(ids: [ID!]!): Boolean
		createMenu(data: MenuInputData): Menu!
		createSubMenu(data: SubMenuInputData): SubMenu!
	}


	schema {
		query: RootQuery
		mutation: RootMutation
	}

`)
