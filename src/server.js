import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import express from 'express';
import { useServer } from 'graphql-ws/lib/use/ws';

const startApolloServer = async(typeDefs, resolvers, context, formatError) => {
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const app = express();
  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({ 
    server: httpServer ,
    path: '/graphql',
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    context,
    formatError,
    introspection: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  server.applyMiddleware({ app });
  
  const PORT = process.env.PORT || 4000;
  const URL = process.env.URL_SERVER || 'http://localhost:4000';
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server is now running on ${URL}${PORT}${server.graphqlPath}`);
  });

};

export default startApolloServer;