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
    let targetServer = findServer(req.params.serverId);

    let createdChannel = await db.Channel.create({
      name: req.body.name,
      server: req.params.serverId,
    });

    if (!createdChannel) {
      throw new Error('Could not create channel');
    }

    let { _id, name, server, chatbox } = createdChannel;
    return res.status(200).json({
      _id, name, server, chatbox,
    });
  } catch(error) {
    next({
      status: error.status,
      message: error.message,
    });
  }
}

exports.indexChannels = async function(req, res, next) {
  try {
		// Find Channels.
    let channels = await db.Channel.find({
      server: req.params.serverId,
    });
		console.log(req.params);
		console.log(channels);

    let channelIds = [];
    let channelsById = channels.reduce((acc, channel) => {
      acc[channel._id] = channel;
      channelIds.push(channel._id);
      return acc;
    }, {});

    return res.status(200).json({
      channelIds,
      channelsById,
    });
  } catch(error) {
    next({
      status: error.status,
      message: error.message,
    });
  }
}

exports.updateChannel = async function(req, res, next) {
  try {
    let targetServer = findServer(req.params.serverId);

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
    let targetServer = findServer(req.params.serverId);

    let deletedChannel = await db.Channel.findOneAndDelete({
      _id: req.params.channelId,
    });

    if (!deletedChannel) {
      throw new Error('Could not find channel');
    }

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





