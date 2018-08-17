const express = require('express');
const router = express.Router({ mergeParams: true });
const {
	indexFriends,
  sendFriendRequest,
  acceptFriendRequest,
} = require('../handlers/friends');

router.route('/')
	.get(indexFriends);

router.route('/invite')
	.post(sendFriendRequest);

router.route('/accept')
	.post(acceptFriendRequest);


module.exports = router;


