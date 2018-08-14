const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
	indexUsers,
	indexSingleUser,
	indexFriends,
	addFriend,
} = require('../handlers/user');


router.route('/')
	.get(indexUsers);

router.route('/:userId')
	.get(indexSingleUser);

router.route('/:userId/friends')
	.get(indexFriends);

router.route('/:userId/friends/:friendId')
	.post(addFriend);


module.exports = router;


