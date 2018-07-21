const db = require('../models');


exports.createMessage = async function(req, res, next) {
	try {
		// Find channel.
		let targetChannel = await db.Channel.findOne({
			_id: req.params.channelId,
		});
		if (!targetChannel) {
			next({
				status: 400,
				message: 'Could not find channel',
			});
		}

		// Create message.
		let message = await db.Message.create({
			text: req.body.text,
			user: req.params.userId,
			channel: targetChannel._id,
      server: req.params.serverId,
		});
		if (!message) {
			next({ 
				status: 400,
				message: 'Could not create message',
			});
		}
		// Add messageId to channel.
		targetChannel.messages.push(message._id);
		await targetChannel.save();

		let { _id, server, channel, text } = message;
		return res.status(200).json({
			_id, server, channel, text,
		});
	} catch(error) {
		next({
			status: 400,
			message: error.message,
		});
	}
}

exports.indexMessages = async function(req, res, next) {
	try {
		// // Find channel.
		// let channel = await db.Channel.findOne({
		// 	_id: req.params.channelId,
		// });
		// if (!channel) {
		// 	next({ 
		// 		status: 400,
		// 		message: 'Could not find channel',
		// 	});
		// }

		// Get all messages for channel.
		let messages = await db.Message.find({
			server: req.params.serverId,
		});

		if (!messages) {
			next({
				status: 400,
				message: 'Could not access messages',
			});
		}

		console.log(messages);

		// Parse to normalized format.
		let messageIds = [];
		let messagesById = messages.reduce((acc, message) => {
			acc[message._id] = message;
			messageIds.push(message._id);
			return acc;
		}, {});
		console.log(messagesById);

		return res.status(200).json({
			messagesById,
			messageIds,
		});
	} catch(error) {
		next({
			status: 400,
			message: error.message,
		});
	}
}

