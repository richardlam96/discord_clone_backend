const mongoose = require('mongoose');


var messageSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true,
	},
	user: {
		type: String,
    required: true,
	},
	channel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Channel',
	},
});


module.exports = mongoose.model('Message', messageSchema);

