const User = require('../models/User');
const Webtoon = require('../models/Webtoon');
const Auteur = require('../models/Auteur');
const Achat = require('../models/Achat');

module.exports = {
  Query: {
    users: () => User.find(),
    me: (_, __, context) => context.user,
    user: (_, { id }) => User.findById(id),

    webtoons: async () => {
      return await Webtoon.find(); // Pas de .populate ici
    },
    webtoon: async (_, { id }) => {
      return await Webtoon.findById(id);
    },

    mesAchats: async (_, __, context) => {
      if (!context.user) throw new Error("Non authentifié");
      return await Achat.find({ user: context.user._id });
    },

    aDejaAchat: async (_, { webtoonId, numero_chapitre }, context) => {
      if (!context.user) throw new Error("Non authentifié");
      const achat = await Achat.findOne({
        user: context.user._id,
        webtoon: webtoonId,
        numero_chapitre
      });
      return !!achat;
    }
  },

  Mutation: {
    register: async (_, { pseudo, email, mot_de_passe }) => {
      const user = new User({
        pseudo,
        email,
        mot_de_passe,
        pieces: 0,
        role: 'utilisateur'
      });
      return await user.save();
    },

    login: async (_, { pseudo, mot_de_passe }) => {
      const user = await User.findOne({ pseudo, mot_de_passe });
      if (!user) throw new Error('Identifiants invalides');
      return user;
    },

    ajouterPieces: async (_, { montant }, context) => {
      if (!context.user) throw new Error("Non authentifié");
      const user = await User.findById(context.user._id);
      user.pieces += montant;
      return await user.save();
    },

    ajouterWebtoon: async (_, {
      titre,
      resume,
      genre,
      nb_chapitres,
      nb_chapitres_gratuits,
      auteurId,
      image
    }) => {
      const webtoon = new Webtoon({
        titre,
        resume,
        genre,
        nb_chapitres,
        nb_chapitres_gratuits,
        auteur: auteurId,
        image
      });
      return await webtoon.save();
    },

    modifierWebtoon: async (_, args) => {
      const { id, ...modifs } = args;
      Object.keys(modifs).forEach(key => {
        if (modifs[key] === undefined) delete modifs[key];
      });
      return await Webtoon.findByIdAndUpdate(id, modifs, { new: true });
    },

    supprimerWebtoon: async (_, { id }) => {
      await Webtoon.findByIdAndDelete(id);
      return true;
    },

    acheterChapitre: async (_, { webtoonId, numero_chapitre }, context) => {
      if (!context.user) throw new Error("Non authentifié");

      const user = await User.findById(context.user._id);
      const webtoon = await Webtoon.findById(webtoonId);
      if (!webtoon) throw new Error("Webtoon introuvable");

      const dejaAchat = await Achat.findOne({
        user: user._id,
        webtoon: webtoon._id,
        numero_chapitre
      });

      if (dejaAchat) throw new Error("Chapitre déjà acheté");

      if (numero_chapitre <= webtoon.nb_chapitres_gratuits) {
        return await Achat.create({ user: user._id, webtoon: webtoon._id, numero_chapitre });
      }

      if (user.pieces < 1) throw new Error("Pas assez de pièces");

      user.pieces -= 1;
      await user.save();

      return await Achat.create({ user: user._id, webtoon: webtoon._id, numero_chapitre });
    }
  },

  Achat: {
    user: (achat) => User.findById(achat.user),
    webtoon: (achat) => Webtoon.findById(achat.webtoon)
  },

  Webtoon: {
    auteur: async (webtoon) => {
      if (!webtoon.auteur) return null;
      if (typeof webtoon.auteur === 'object' && webtoon.auteur.nom) {
        return webtoon.auteur; // déjà peuplé
      }
      return await Auteur.findById(webtoon.auteur);
    }
  }
};
