const db = require('../models');


// These handlers will use userId/ownerId, so CRUD actions cannot be perormed
// randomly.


// Create a Server for a given User.
exports.createServer = async function(req, res, next) {
  try {
    // Create new Server.
    let newServer = await db.Server.create({
      name: req.body.name,
      owner: req.body.ownerId,
    });

    if (!newServer) {
      throw new Error('Could not create server.');
    }

    // Find owner and add new Server's id to owner's server array.
    let owner = await db.User.findOne({
      _id: newServer.owner,
    });

    // Add Owner to Server's member list and Server to Owner's owned Servers.
    newServer.members.push(owner._id);
    newServer.save();
    owner.servers.push(newServer._id);
    owner.save();

    return res.status(200).json({
      ...newServer,
    });
  } catch(error) {
    next({
      status: 400,
      message: error.message,
    });
  }
}

// Fetch all Servers that a given User owns.
exports.indexServers = async function(req, res, next) {
  try {
    // Find Servers that are owned by User.
    let servers = await db.Server
      .find({ owner: req.body.ownerId })
      .populate('channels');

    if (servers.length === 0) {
      throw new Error('User does not have any servers.');
    }

    let serversById = servers.reduce((acc, server) => {
      acc[server._id] = server;
      return acc;
    }, {});

    return res.status(200).json({
      ...serversById,
    });
  } catch(error) {
    next({
      status: 400,
      message: error.message,
    });
  }
}

// Update a Server for a User.
exports.updateServer = async function(req, res, next) {
  try {
    // Find the Server that needs to be updated.
    let server = await db.Server.findOneAndUpdate({
      _id: req.body.serverId,
      owner: req.body.ownerId,
    }, {
      name: req.body.name,
    }, { new: true });

    if (!server) {
      throw new Error('This server does not exist or does not belong to the User.');
    }

    return res.status(200).json({
      ...server,
    });
  } catch(error) {
    next({
      status: 400,
      message: error.message,
    });
  }
}

// Delete a Server for a User.
exports.deleteServer = async function(req, res, next) {
  try {
    // Find and delete target Server.
    let removedServer = await db.Server.findOneAndDelete({
      _id: req.body.serverId,
    });

    if (!removedServer) {
      throw new Error('Server not found in database.');
    }

    return res.status(200).json({
      ...removedServer,
    });
  } catch(error) {
    next({
      status: 400,
      message: error.message,
    });
  }
}

















































