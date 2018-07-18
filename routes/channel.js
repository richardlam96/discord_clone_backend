const express = require('express');
const router = express.Router();
const { ensureCorrectUser } = require('../middleware/auth');
const { 
  createChannel,
  indexChannels,
  updateChannel,
  deleteChannel,
} = require('../handlers/channel');


router.route('/:ownerId/servers/:serverId/channels')
  .get(ensureCorrectUser, indexChannels)
  .post(ensureCorrectUser, createChannel);

router.route('/:ownerId/servers/:serverId/channels/:channelId')
  .put(ensureCorrectUser, updateChannel)
  .delete(ensureCorrectUser, deleteChannel);


module.exports = router;
