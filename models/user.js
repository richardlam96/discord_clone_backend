const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    let hashedPassword = await bcrypt.hash(this.password, 100);
    this.password = hashedPassword;
    return next();
  } catch(error) {
    return next(error);
  }
});

userSchema.method.comparePassword = async function(candidatePassword, next) {
  try {
    let isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch(error) {
    return next();
  }
}


module.exports = mongoose.model('User', userSchema);
