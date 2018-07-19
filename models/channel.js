const mongoose = require('mongoose');


var channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
  server: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Server',
  },
  chatbox: [{
    type: String,
  }],
});


module.exports = mongoose.model('Channel', channelSchema);

