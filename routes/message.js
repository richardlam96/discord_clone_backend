const express = require('express');
const router = express.Router();
const { 
	createMessage,
	indexMessages,
} = require('../handlers/message');


const RESTFUL_ROUTE = '/api/users/:userId/servers/:serverId/' 
                      + 'channels/:channelId/messages';


// Slightly shortened route for easier messaging access.                  
router.route('/api/users/:userId/servers/:serverId/messages/')
	.get(indexMessages);

router.route(RESTFUL_ROUTE + '/')
	.post(createMessage);


module.exports = router;
