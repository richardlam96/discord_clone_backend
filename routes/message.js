const express = require('express');
const router = express.Router();
const { ensureCorrectUser } = require('../middleware/auth');
const { 
	createMessage,
	indexMessages,
} = require('../handlers/message');


router.route('/servers/:serverId/messages')
	.get(indexMessages)

router.route('/servers/:serverId/channels/:channelId/messages')
	.post(createMessage);


module.exports = router;
