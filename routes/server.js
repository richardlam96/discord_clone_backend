const express = require('express');
const router = express.Router();
const { 
  createServer,
  indexServers,
  updateServer,
  deleteServer,
} = require('../handlers/server');


const RESTFUL_ROUTE = '/api/users/:userId/servers';

router.route(RESTFUL_ROUTE + '/')
  .get(indexServers);
  .post(createServer);

router.route(RESTFUL_ROUTE + '/:serverId')
  .put(updateServer)
  .delete(deleteServer);


module.exports = router;
