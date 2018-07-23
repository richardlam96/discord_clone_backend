const express = require('express');
const router = express.Router();
const { 
  createChannel,
  indexChannels,
  updateChannel,
  deleteChannel,
} = require('../handlers/channel');


const RESTFUL_ROUTE = '/api/users/:userId/servers/:serverId/channels';

router.route(RESTFUL_ROUTE + '/')
  .get(indexChannels);
  .post(createChannel);

router.route(RESTFUL_ROUTE + '/:channelId')
  .put(updateChannel)
  .delete(deleteChannel);


module.exports = router;
