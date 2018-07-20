const mongoose = require('mongoose');


var messageSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	channel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Channel',
	},
});


module.exports = mongoose.model('Message', messageSchema);

