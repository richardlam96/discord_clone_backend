const mongoose = require('mongoose');


var channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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

