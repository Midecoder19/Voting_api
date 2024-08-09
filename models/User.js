const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  matricNumber: { type: String, required: true },
  level: { type: String, required: true },
  nacosId: { type: String }, // Optional if not all users have it
  password: { type: String, required: true }
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
