const express = require('express');
const router = express.Router();
const { 
  createChannel,
  indexChannels,
  updateChannel,
  deleteChannel,
} = require('../handlers/channel');



router.route('/')
  .get(indexChannels)
  .post(createChannel);

router.route('/:channelId')
  .put(updateChannel)
  .delete(deleteChannel);


module.exports = router;
