const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  matricNumber: { type: String, required: true, unique: true },
  nacosId: { type: String, required: true },
  level: { type: String, enum: ['ND1', 'HND1'], required: true },
  password: { type: String, required: true }
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
