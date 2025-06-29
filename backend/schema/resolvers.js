const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Webtoon = require('../models/Webtoon');
const Achat = require('../models/Achat');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  Query: {
    users: async () => await User.find(),
    me: (_, __, context) => context.user,
    user: (_, { id }) => User.findById(id),

    webtoons: async () => await Webtoon.find(),
    webtoon: async (_, { id }) => await Webtoon.findById(id),

    mesAchats: async (_, __, context) => {
      if (!context.user) throw new Error("Non authentifié");
      return await Achat.find({ user: context.user._id }).sort({ createdAt: -1 });
    },


    aDejaAchat: async (_, { webtoonId, numero_chapitre }, context) => {
      if (!context.user) throw new Error("Non authentifié");
      const achat = await Achat.findOne({
        user: context.user._id,
        webtoon: webtoonId,
        numero_chapitre
      });
      return !!achat;
    },

    achatsParWebtoon: async (_, { webtoonId }, context) => {
      if (!context.user) throw new Error("Non authentifié");
      const achats = await Achat.find({ user: context.user._id, webtoon: webtoonId });
      return achats.map(a => a.numero_chapitre);
    }
  },

  Mutation: {
    register: async (_, { pseudo, email, mot_de_passe }) => {
      const existingPseudo = await User.findOne({ pseudo });
      if (existingPseudo) throw new Error("Ce pseudo est déjà utilisé.");

      const existingEmail = await User.findOne({ email });
      if (existingEmail) throw new Error("Cet email est déjà utilisé.");

      const user = new User({
        pseudo,
        email,
        mot_de_passe,
        pieces: 10,
        role: 'utilisateur'
      });

      return await user.save();
    },

    login: async (_, { pseudo, mot_de_passe }) => {
      const user = await User.findOne({ pseudo, mot_de_passe });
      if (!user) throw new Error('Identifiants invalides');

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      return { user, token };
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
      auteur,
      image
    }) => {
      const webtoon = new Webtoon({
        titre,
        resume,
        genre,
        nb_chapitres,
        nb_chapitres_gratuits,
        auteur,
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
    user: async (achat) => {
      return await User.findById(achat.user);
    },
    webtoon: async (achat) => {
      return await Webtoon.findById(achat.webtoon);
    }
  }
};
