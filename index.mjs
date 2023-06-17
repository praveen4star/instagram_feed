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
import dotenv from 'dotenv';

dotenv.config();

import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";

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
      resolvers: resolversArray,
  }
)
// Set up Apollo Server
const server = new ApolloServer({
  Upload: graphqlUploadExpress,
  schema: schema,
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  introspection : true,
});
await server.start();

app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  cors(),
  bodyParser.json(),
  expressMiddleware(server),
);

const port = process.env.PORT || 4000;
await new Promise((resolve) => httpServer.listen({ port }, resolve));

console.log(`🚀 Server ready at http://localhost:${port}`);