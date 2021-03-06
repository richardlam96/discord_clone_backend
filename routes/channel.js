const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
  createChannel,
  indexChannels,
	indexChannelsByUser,
  updateChannel,
  deleteChannel,
} = require('../handlers/channel');


const RESTFUL_ROUTE = '/servers/:serverId/channels';

router.route(RESTFUL_ROUTE + '/')
  .get(indexChannels)
  .post(createChannel);

router.route(RESTFUL_ROUTE + '/:channelId')
  .put(updateChannel)
  .delete(deleteChannel);

// Custom route to index by User.
router.route('/channels')
	.get(indexChannelsByUser);

module.exports = router;
