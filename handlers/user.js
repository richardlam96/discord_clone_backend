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
			return db.User.findById(friendId);
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

exports.sendFriendRequest = async function(req, res, next) {
  try {
    let user = await db.User.findById(req.params.userId);
    let invitee = await db.User.findById(req.params.inviteeId);

    // Add invitee to user's outgoing requests.
    user.outgoingRequests.push(invitee._id);
    user.save();

    // Add user to invitee's incoming requests.
    invitee.incomingRequests.push(user._id);
    invitee.save();

    return res.status(200).json({
      invitee: invitee._id,
      message: 'Friend request sent',
    });
  } catch(error) {
    next({
      status: 400,
      message: error.message,
    });
  }
}

exports.acceptFriendRequest = async function(req, res, next) {
  try {
    let user = await db.User.findById(req.params.userId);

    // Remove friend id from incoming and move to friends.
    let friendIndex = user.incomingRequests.indexOf(req.params.friendId);
    let friend = user.incomingRequests.splice(friendIndex, 1);
    user.friends.push(friend);
    user.save();

    return res.status(200).json({
      friend,
      message: 'Added a new friend',
    });
  } catch(error) {
    next({
      status: 400,
      message: error.message,
    });
  }
}








