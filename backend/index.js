require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');
const User = require('./models/User');

async function startServer() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');

      if (!token) return {};

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        return { user };
      } catch (err) {
        console.error('❌ Erreur de vérification du token:', err.message);
        return {};
      }
    }
  });

  await server.start();
  server.applyMiddleware({ app });

  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("✅ MongoDB connecté"));

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Serveur GraphQL dispo sur http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
