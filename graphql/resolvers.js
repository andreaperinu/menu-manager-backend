const bcrypt = require('bcryptjs')
const validator = require('validator')

const User = require('../models/user')
const Dish = require('../models/dish')
const SubMenu = require('../models/subMenu')
const Menu = require('../models/menu')

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

function createSubMenu({ data: { name, items } }, _) {

	const dishes = items.map(({ name, description, price }) =>
		createDish({ data: { name, description, price } })
	)

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

async function dishes({ page }, _) {
	const basePage = page >= 1 ? page : 1
	const perPage = 10
	const totalDishes = await Dish.find().countDocuments()

	const dishes = await Dish.find()
		.sort({ createdAt: -1 })
		.skip((basePage - 1) * perPage)
		.limit(perPage)
		.populate('creator')

	return {
		items: dishes.map(d => ({ ...d._doc, _id: d._id.toString() })),
		count: totalDishes
	}
}

module.exports = {

	// Setters
	createUser,
	createDish,
	createSubMenu,
	createMenu,

	// Getters
	dishes
}
