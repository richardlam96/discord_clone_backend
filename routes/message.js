const express = require('express');
const router = express.Router();
const { ensureCorrectUser } = require('../middleware/auth');
const { 
	createMessage,
	indexMessages,
} = require('../handlers/message');


router.route('/:ownerId/channels/:channelId/messages')
	.get(indexMessages)
	.post(createMessages);


module.exports = router;
