const db = require('../models');


// These handlers will use userId/ownerId, so CRUD actions cannot be perormed
// randomly.


// Create a Server for a given User.
exports.createServer = async function(req, res, next) {
  try {
    // Find owner and add new Server's id to owner's server array.
    let serverOwner = await db.User.findOne({
      _id: req.body.ownerId,
    });
    
    if (!serverOwner) {
      throw new Error('Could not find user.');
    }

    // Create new Server.
    let newServer = await db.Server.create({
      name: req.body.name,
      owner: serverOwner._id,
    });

    if (!newServer) {
      throw new Error('Could not create server.');
    }


    // Add Owner to Server's member list and Server to Owner's owned Servers.
    newServer.members.push(serverOwner._id);
    serverOwner.servers.push(newServer._id);
    await newServer.save().then(serverOwner.save());

    let { _id, name, owner, channels, members } = newServer;
    return res.status(200).json({
      _id, name, owner, channels, members,
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
      // Should this be sent as an error?
      throw new Error('User does not have any servers.' + req.body.ownerId);
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
      _id: req.params.serverId,
      owner: req.body.ownerId,
    }, {
      name: req.body.name,
    }, { new: true });

    if (!server) {
      throw new Error('This server does not exist or does not belong to the User.');
    }

    return res.status(200).json({
      ...server._doc,
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
      _id: req.params.serverId,
    });

    if (!removedServer) {
      throw new Error('Server not found in database.');
    }

    return res.status(200).json({
      ...removedServer._doc,
    });
  } catch(error) {
    next({
      status: 400,
      message: error.message,
    });
  }
}

















































