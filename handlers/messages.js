const db = require('../models');


exports.createMessage = async function(req, res, next) {
	try {
		// Find channel.
		let channel = await db.Channel.findOne({
			_id: req.params.channelId,
		});
		if (!channel) {
			next({
				status: 400,
				message: 'Could not find channel',
			});
		}

		// Create message.
		let message = await db.Message.create({
			text: req.body.text,
			user: req.params.userId,
			channel: channel._id,
		});
		if (!message) {
			next({ 
				status: 400,
				message: 'Could not create message',
			});
		}

		return res.status(200).json({
			...message,
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
		// Find channel.
		let channel = await db.Channel.findOne({
			_id: req.params.channelId,
		});
		if (!channel) {
			next({ 
				status: 400,
				message: 'Could not find channel',
			});
		}

		// Get all messages for channel.
		let messages = await db.Message.find({
			channel: req.params.channelId,
		});

		// Parse to normalized format.
		let messageIds = [];
		let messagesById = messages.reduce((acc, message) => {
			acc[message._id] = message;
			messageIds.push(message._id);
			return acc;
		}, {});

		return res.status(200).json({
			messagesById,
			messageIds,
		});
	} catch(error) {
		next({
			status: 400,
			message: error.messsage,
		});
	}
}

