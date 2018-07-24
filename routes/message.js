const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
	createMessage,
	indexMessages,
} = require('../handlers/message');


const RESTFUL_ROUTE = '/servers/:serverId/'
                      + 'channels/:channelId/messages';

router.route(RESTFUL_ROUTE + '/')
	.get(indexMessages)
	.post(createMessage);


module.exports = router;
