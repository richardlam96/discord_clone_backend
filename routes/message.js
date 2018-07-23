const express = require('express');
const router = express.Router();
const { 
	createMessage,
	indexMessages,
} = require('../handlers/message');


// Can use: /api/users/:userId/servers/:serverId/messages
// Only slightly shorter.
// 
router.route('/')
	.get(indexMessages)
	.post(createMessage);


module.exports = router;
