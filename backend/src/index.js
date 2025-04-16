// src/index.js
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PrismaClient } from '@prisma/client';
import './loadEnv.js'; 
import { verifyToken } from './auth/jwt.js';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import { graphqlUploadExpress } from './shims/graphql-upload.js';
import redis from './utils/redis.js';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 4000;
const env = process.env.NODE_ENV;

const baseUrl =
  env === 'production'
    ? 'https://thy-khuu-porfolio-production.up.railway.app'
    : `http://localhost:${port}`;

// ✅ CORS config
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4000',
  'https://thy-khuu-porfolio.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
}));

// ✅ Middleware
app.use(graphqlUploadExpress({ maxFileSize: 100_000_000, maxFiles: 5 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Apollo Server
const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer({ schema });
await server.start();

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = req.headers.authorization || '';
      const token = auth.replace('Bearer ', '');
      let userId = null;

      if (token) {
        try {
          const decoded = verifyToken(token);
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

app.listen(port, () => {
  console.log(`🚀 Apollo Server running in ${env} mode at ${baseUrl}/graphql`);
});

// ✅ Cleanup
process.on('SIGINT', async () => {
  try {
    console.log('\n🧹 Cleaning up resources...');
    await redis.flushAll();
    await redis.quit();
    console.log('✅ Redis disconnected');

    await prisma.$disconnect();
    console.log('✅ Prisma disconnected');
    console.log('👋 Server exiting...');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during shutdown:', err);
    process.exit(1);
  }
});
