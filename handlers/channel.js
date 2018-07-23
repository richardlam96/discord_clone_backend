const db = require('../models');


async function findServer(serverId) {
  let server = await db.Server.findOne({
    _id: serverId,
  });

  if (!server) {
    throw new Error('Server was not found');
  }

  return server;
}



exports.createChannel = async function(req, res, next) {
  try {
    // Find the Server.
    let targetServer = await findServer(req.params.serverId);

    // Create the Channel.
    let createdChannel = await db.Channel.create({
      name: req.body.name,
      server: req.params.serverId,
			owner: req.params.ownerId,
    });
    if (!createdChannel) {
      throw new Error('Could not create channel');
    }

		// Add Channel id to Server.
		targetServer.channels.push(createdChannel._id);
		await targetServer.save();

    let { _id, name, owner, server, messages } = createdChannel;
    return res.status(200).json({
      _id, name, owner, server, messages,
    });
  } catch(error) {
    next({
      status: error.status,
      message: error.message,
    });
  }
}

// exports.indexChannels = async function(req, res, next) {
//   try {
// 		// Find Channels.
//     let channels = await db.Channel.find({
//       server: req.params.serverId,
//     });
// 
//     let channelIds = [];
//     let channelsById = channels.reduce((acc, channel) => {
//       acc[channel._id] = channel;
//       channelIds.push(channel._id);
//       return acc;
//     }, {});
// 
//     return res.status(200).json({
//       channelIds,
//       channelsById,
//     });
//   } catch(error) {
//     next({
//       status: error.status,
//       message: error.message,
//     });
//   }
// }

exports.indexChannels = async function(req, res, next) {
	try {
		// Get all Channels by given User.
		let channels = await db.Channel.find({
			owner: req.params.ownerId,
		});

		let channelIds = [];
		let channelsById = channels.reduce((acc, channel) => {
			acc[channel._id] = channel;
			channelIds.push(channel._id);
			return acc;
		}, {});
    
		return res.status(200).json({
			channelsById,
			channelIds,
		});
	} catch(error) {
		next({
			status: 400,
			message: error.message,
		});
	}
}


exports.updateChannel = async function(req, res, next) {
  try {
		// Check that server exists.
    let targetServer = await findServer(req.params.serverId);

    let updatedChannel = await db.Channel.findOneAndUpdate(req.body);

    if (!updatedChannel) {
      throw new Error('Could not find channel');
    }

    return res.status(200).json({
      ...updatedChannel._doc,
    });
  } catch(error) {
    next({
      status: error.status,
      message: error.message,
    });
  }
}

exports.deleteChannel = async function(req, res, next) {
  try {
    // Find the Server.
    let targetServer = await findServer(req.params.serverId);

    // Remove messages in Channel.
    let deletedMessages = await db.Message.remove({
      channel: req.params.channelId,
    });

    // Delete Channel.
    let deletedChannel = await db.Channel.findOneAndDelete({
      _id: req.params.channelId,
    });
    if (!deletedChannel) {
      throw new Error('Could not find channel');
    }

    // Remove channel from server's channel list
    let removedChannel = targetServer.channels.indexOf(deletedChannel._id);
    targetServer.channels.splice(removedChannel, 1);
    await targetServer.save();

    return res.status(200).json({
      ...deletedChannel._doc,
    });
  } catch(error) {
    next({
      status: error.status,
      message: error.message,
    });
  }
}





