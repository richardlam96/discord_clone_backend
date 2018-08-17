const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
	indexUsers,
	indexSingleUser,
} = require('../handlers/user');


router.route('/')
	.get(indexUsers);

router.route('/:userId')
	.get(indexSingleUser);

module.exports = router;


