const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  pseudo: String,
  email: { type: String, unique: true },
  mot_de_passe: String,
  pieces: { type: Number, default: 0 },
  role: { type: String, enum: ['utilisateur', 'admin'], default: 'utilisateur' }
});

module.exports = mongoose.model('User', userSchema);
