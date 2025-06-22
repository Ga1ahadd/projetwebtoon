const mongoose = require('mongoose');

const webtoonSchema = new mongoose.Schema({
  image: String,
  titre: String,
  auteur: { type: String, required: true },
  genre: String,
  nb_chapitres: Number,
  nb_chapitres_gratuits: Number,
  resume: String
});

module.exports = mongoose.model('Webtoon', webtoonSchema);
