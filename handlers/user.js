const db = require('../models');


exports.indexUsers = async function(req, res, next) {
	try {
		// Get all Users.
		let users = await db.User.find();

		// Parse into normalized format.
		let userIds = [];
		let usersById = users.reduce((acc, user) => {
			acc[user._id] = user;
			userIds.push(user._id);
			return acc;
		}, {});

		return res.status(200).json({
			usersById,
			userIds,
		});
	} catch(error) {
		next({
			status: 400,
			message: error.message,
		});
	}
}
