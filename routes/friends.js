const express = require('express');
const router = express.Router({ mergeParams: true });
const {
	indexFriends,
  sendFriendRequest,
  acceptFriendRequest,
} = require('../handlers/friends');

router.route('/:userId/friends')
	.get(indexFriends);

router.route('/:userId/friends/:friendId/invite')
	.post(sendFriendRequest);

router.route('/:userId/friends/:friendId/accept')
	.post(acceptFriendRequest);


module.exports = router;


