const mongoose = require('mongoose');

const webtoonSchema = new mongoose.Schema({
  image: String,
  titre: String,
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'Auteur' },
  genre: String,
  nb_chapitres: Number,
  nb_chapitres_gratuits: Number,
  resume: String
});

module.exports = mongoose.model('Webtoon', webtoonSchema);
