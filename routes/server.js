const express = require('express');
const router = express.Router();
const { ensureCorrectUser } = require('../middleware/auth');
const { 
  createServer,
  indexServers,
  updateServer,
  deleteServer,
} = require('../handlers/server');


router.route('/:ownerId/servers')
  .get(indexServers)
  .post(createServer);

router.route('/:ownerId/servers/:serverId')
  .put(ensureCorrectUser, updateServer)
  .delete(ensureCorrectUser, deleteServer);


module.exports = router;
