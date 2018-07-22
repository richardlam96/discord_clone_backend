const db = require('../models');


// These handlers will use userId/ownerId, so CRUD actions cannot be performed
// randomly.

// Create a Server for a given User.
exports.createServer = async function(req, res, next) {
  try {
		if (!req.params.ownerId) {
			throw new Error('No ownerId parameter');
		}

    // Find owner and add new Server's id to owner's server array.
    let serverOwner = await db.User.findOne({
      _id: req.params.ownerId,
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
    await newServer.save();
		await serverOwner.save();

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
      .find({ owner: req.params.ownerId })

		let serverIds = [];
    let serversById = servers.reduce((acc, server) => {
      acc[server._id] = server;
			serverIds.push(server._id);
      return acc;
    }, {});

    return res.status(200).json({
      serversById,
			serverIds,
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
    // Find the Server's User.
    let user = await db.User.findOne({
      _id: req.params.userId,
    });
    if (!user) {
      throw new Error('User could not be found'):
    }

    // Find the Server.
    let removedServer = await db.Server.findOneAndDelete({
      _id: req.params.serverId,
      owner: req.params.userId,
    });
    if (!server) {
      throw new Error('Server could not be found');
    }

    // Create promises for deleting the related Channels and Messages.
    let promises = [];
    promises.push(
      db.Channel.remove({
        server: req.params.serverId,
      }),
      db.Message.remove({
        server: req.params.serverId,
      })
    );

    // Fullfill all Promises.
    await Promise.all(promises);
    
		// Remove Server from Users.
    let removedServerIndex = user.servers.indexOf(req.params.serverId);
    user.servers.splice(removedServerIndex, 1);
    await user.save();

    // Return information of removed Server.
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

















































