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
const app = express();
const port = process.env.PORT

// ✅ Enable CORS globally
app.use(cors({
  origin: true,
  credentials: true,
}));

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

app.listen({ port: port }, () => {
  console.log(`🚀 Apollo Server running at http://localhost:${port}/graphql`);
});
