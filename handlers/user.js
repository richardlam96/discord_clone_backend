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

// FRIENDS *******************************************************************
exports.indexFriends = async function(req, res, next) {
	try {
		// Find User.
		let user = await db.User.findById(req.params.userId);
		if (!user) {
			next({
				status: 400,
				message: 'User was not found',
			});
		}

		// Get the data of all friends.
		let friendsDataPromises = user.friends.map(friendId => {
			return db.User.findOne({ id: friendId });
		});

		let friendsData = await Promise.all(friendsDataPromises);

		// Return a normalized format.
		let friendIds = [];
		let friendsById = friendsData.reduce((acc, friend) => {
			friendIds.push(friend._id);
			acc[friend._id] = friend;
			return acc;
		}, {});

		return res.status(200).json({
			friendsById,
			friendIds,
		});
	} catch(error) {
		next({ 
			status: 400,
			message: error.message,
		});
	}
}

exports.addFriend = async function(req, res, next) {
	try {
		// Find User.
		let user = await db.User.findById(req.params.userId);
		if (!user) {
			next({
				status: 400,
				message: 'User not found.',
			});
		}

		// Find User to add as friend.
		let friend = await db.User.findById(req.params.friendId);
		if (!friend) {
			next({
				status: 400,
				message: 'Friend not found.',
			});
		}

		// Add friend to User's friend list.
		user.friends.push(friend._id);
		user.save();

		return res.status(200).json({
			message: 'Successfully added a friend!',
		});
	} catch(error) {
		next({
			status: 400,
			message: error.message,
		});
	}
}


		
