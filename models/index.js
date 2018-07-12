const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/discord_clone', {
  keepAlive: true,
});

mongose.exports.User = require('./user');
