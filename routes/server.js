const express = require('express');
const router = express.Router();
const { 
  createServer,
  indexServers,
  updateServer,
  deleteServer,
} = require('../handlers/server');



router.route('/')
  .get(indexServers)
  .post(createServer);

router.route('/:serverId')
  .put(updateServer)
  .delete(deleteServer);


module.exports = router;
