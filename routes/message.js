const express = require('express');
const router = express.Router();
const { 
	createMessage,
	indexMessages,
} = require('../handlers/message');


const RESTFUL_ROUTE = '/api/users/:userId/servers/:serverId/' 
                      + 'channels/:channelId/messages';

router.route(RESTFUL_ROUTE + '/')
	.get(indexMessages)
	.post(createMessage);


module.exports = router;
