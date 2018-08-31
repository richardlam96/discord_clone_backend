const db = require('../models');


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
    let invitee = await db.User.find({
      username: req.body.inviteeUsername,
    });

    // Add invitee to user's outgoing requests.
    user.outgoingRequests.push(invitee._id);

    // Add user to invitee's incoming requests.
    invitee.incomingRequests.push(user._id);

    // Save changes.
    await user.save();
    await invitee.save();

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
    let friend = await db.User.find({
      username: req.body.friendUsername,
    });

    // Remove friend id from incoming and move to friends.
    let friendIndex = user.incomingRequests.indexOf(friend._id);
    let friendId = user.incomingRequests.splice(friendIndex, 1);
    user.friends.push(friendId);

    // Remove user's id from friend's outgoing.
    let userIndex = friend.outgoingRequests.indexOf(friend._id);
    let userId = friend.outgoingRequests.splice(userIndex, 1);
    friend.friends.push(userId);

    // Save changes.
    await user.save();
    await friend.save();


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





