const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    pseudo: String!
    email: String!
    pieces: Int!
    role: String!
    token: String
  }

  type Webtoon {
    id: ID!
    titre: String!
    resume: String
    genre: String
    image: String
    nb_chapitres: Int!
    nb_chapitres_gratuits: Int!
    auteur: String!
  }

  type Achat {
    id: ID!
    user: User!
    webtoon: Webtoon!
    numero_chapitre: Int!
    createdAt: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Query {
    users: [User]
    me: User
    user(id: ID!): User

    webtoons: [Webtoon]
    webtoon(id: ID!): Webtoon

    mesAchats: [Achat]
    aDejaAchat(webtoonId: ID!, numero_chapitre: Int!): Boolean
  }

  type Mutation {
    register(pseudo: String!, email: String!, mot_de_passe: String!): User
    login(pseudo: String!, mot_de_passe: String!): AuthPayload
    ajouterPieces(montant: Int!): User

    ajouterWebtoon(
      titre: String!
      resume: String
      genre: String
      nb_chapitres: Int!
      nb_chapitres_gratuits: Int!
      auteur: String!
      image: String
    ): Webtoon

    modifierWebtoon(
      id: ID!
      titre: String
      resume: String
      genre: String
      nb_chapitres: Int
      nb_chapitres_gratuits: Int
      auteur: String
      image: String
    ): Webtoon

    supprimerWebtoon(id: ID!): Boolean

    acheterChapitre(webtoonId: ID!, numero_chapitre: Int!): Achat
  }
`;
