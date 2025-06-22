const mongoose = require('mongoose');

const auteurSchema = new mongoose.Schema({
  nom: String
});

module.exports = mongoose.model('Auteur', auteurSchema);
