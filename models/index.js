const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
});

module.exports.User = require('./user');
module.exports.Server = require('./server');
module.exports.Channel = require('./channel');
module.exports.Message = require('./message');
