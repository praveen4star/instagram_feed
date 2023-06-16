import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './config/db.connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The GraphQL schem
const typeDefs = loadFilesSync('**/*', {extensions : ['graphql']});
const resolversArray = loadFilesSync(path.join(__dirname, "**/*.resolver.js"));

// A map of functions which return data for the schema.


const app = express();
const httpServer = http.createServer(app);
const schema = makeExecutableSchema(
  {
      typeDefs: typeDefs,
      resolvers: resolversArray
  }
)
// Set up Apollo Server
const server = new ApolloServer({
  schema : schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use(
  cors(),
  bodyParser.json(),
  expressMiddleware(server),
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀 Server ready at http://localhost:4000`);