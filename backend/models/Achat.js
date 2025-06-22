const mongoose = require('mongoose');

const achatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  webtoon: { type: mongoose.Schema.Types.ObjectId, ref: 'Webtoon' },
  numero_chapitre: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Achat', achatSchema);
