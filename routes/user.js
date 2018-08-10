const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
	indexUsers,
} = require('../handlers/user');


router.route('/')
	.get(indexUsers);


module.exports = router;


