const bcrypt = require('bcryptjs')
const validator = require('validator')

const User = require('../models/user')
const Dish = require('../models/dish')
const SubMenu = require('../models/subMenu')
const Menu = require('../models/menu')

// Setters
async function createUser({ userInput: { email, name, password } }, _) {

	const errors = []
	if (!validator.isEmail(email)) {
		errors.push({ message: 'E-Mail is invalid.' })
	}

	if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
		errors.push({ message: 'Password too short' })
	}

	if (errors.length) {
		const error = new Error('Invalid input')
		error.data = errors
		error.code = 422
		throw error
	}

	const existingUser = await User.findOne({ email })
	if (existingUser) {
		const error = new Error('User exists already!')
		throw error
	}

	const hashedPassword = await bcrypt.hash(password, 12)
	const user = new User({ email, name, password: hashedPassword })

	const createdUser = await user.save()
	return { ...createdUser._doc, _id: createdUser._id.toString() }
}

async function createDish({ data: { name, description, price } }, _) {
	const dish = new Dish({ name, description, price })
	const createdDish = await dish.save()
	return { ...createdDish._doc, _id: createdDish._id.toString() }
}

async function deleteDish({ id }, _) {
	const dish = await Dish.findById(id)

	if (!dish) {
		const error = new Error(`Dish ${id} not found!`)
		error.code = 404
		throw error
	}

	await Dish.findByIdAndRemove(id)
	return true
}

function deleteDishes({ ids }) {
	return ids.map(async (id) => await deleteDish({ id })).reduce((a, b) => a && b)
}

function createSubMenu({ data: { name, items } }, _) {

	const dishes = items.map(({ name, description, price }) => {
		const createdDish = new Dish({ name, description, price })
		return { ...createdDish._doc, _id: createdDish._id.toString() }
	})

	return Promise
		.all(dishes)
		.then((resolvedDishes) => {
			const subMenu = new SubMenu({ name, items: resolvedDishes })
			return { ...subMenu._doc, _id: subMenu._id.toString() }
		})
		.catch(err => console.log(err))
}

async function createMenu({ data: { name, items } }, _) {

	const subMenus = items.map(({ name, items }) => createSubMenu({ data: { name, items } }))

	return Promise
		.all(subMenus)
		.then(async (resolvedSubMenus) => {
			const menu = new Menu({ name, items: resolvedSubMenus })
			const createdMenu = await menu.save()
			return { ...createdMenu._doc, _id: createdMenu._id.toString() }
		})
		.catch(err => console.log(err))
}


// Getters
async function dish({ id }) {
	const post = await Dish.findById(id)

	if (post) return { ...post._doc, _id: post._id.toString() }

	const error = new Eror('Dish not found')
	error.code = 404
	throw error
}

async function dishes({ page }, _) {
	// const basePage = page >= 1 ? page : 1
	// const perPage = 10
	const totalDishes = await Dish.find().countDocuments()

	const dishes = await Dish.find()
		.sort({ createdAt: -1 })
		// .skip((basePage - 1) * perPage)
		// .limit(perPage)

	return {
		items: dishes.map(d => ({ ...d._doc, _id: d._id.toString() })),
		count: totalDishes
	}
}

async function menu({ id }) {
	const menu = await Menu.findById(id).populate('creator')

	if (menu) return { ...menu._doc, _id: menu._id.toString() }

	const error = new Error('Menu not found')
	error.code = 404
	throw error
}

async function menus({ page }, _) {
	const basePage = page >= 1 ? page : 1
	const perPage = 10
	const totalMenus = await Menu.find().countDocuments()

	const menus = await Menu.find()
		.sort({ creattedAt: -1 })
		.skip((basePage - 1) * perPage)
		.limit(perPage)

	return {
		items: menus.map(d => ({ ...d._doc, _id: d._id.toString() })),
		count: totalMenus
	}
}

module.exports = {
	// Setters
	createUser,
	createDish,
	createSubMenu,
	createMenu,
	deleteDish,
	deleteDishes,

	// Getters
	dish,
	dishes,
	menu,
	menus
}
