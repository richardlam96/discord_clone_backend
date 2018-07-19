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


modules.export = mongoose.model('Message', messageSchema);

