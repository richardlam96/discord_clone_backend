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

exports.indexSingleUser = async function(req, res, next) {
	try {
		let user = await db.User.findById(req.params.userId);
		if (!user) {
			next({
				status: 400,
				message: 'User was not found.',
			});
		}

		let { id, username, password, servers, friends } = user;
		return res.status(200).json({
			id, username, password, servers, friends,
		});
	} catch(error) {
		next({
			status: 400,
			message: error.message,
		});
	}
}





