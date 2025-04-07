// src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { verifyToken } from './auth/jwt.js';
import { PrismaClient } from '@prisma/client';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import { graphqlUploadExpress } from 'graphql-upload-minimal';

dotenv.config();

const prisma = new PrismaClient();

// ✅ Enable CORS for specific origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://thy-khuu-porfolio.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow no origin (like curl or postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
}));

const app = express();

// ✅ graphql-upload must come before any body parsers
app.use(graphqlUploadExpress());

// ✅ Parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Create schema and server
const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer({ schema });

await server.start();

// ✅ Attach middleware with auth context
app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = req.headers.authorization || '';
      const token = auth.replace('Bearer ', '');
      let userId = null;
    
      if (token) {
        try {
          const decoded = verifyToken(token); // { userId, tokenId }
    
          const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
          if (!user || user.tokenId !== decoded.tokenId) {
            throw new Error('Token is no longer valid');
          }
    
          userId = user.id;
        } catch (err) {
          console.error('❌ Invalid token:', err);
        }
      }
    
      return { userId, prisma };
    },    
  })
);

app.listen({ port: 4000 }, () => {
  console.log(`🚀 Apollo Server running at ${process.env.APP_URL}/graphql`);
});
