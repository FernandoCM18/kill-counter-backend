import 'dotenv/config';
import typeDefs from './schema/schema.graphql';
import resolvers from './resolvers';
import context from './context';
import formatError from './formatError';
import dbConnection  from './db';
import startApolloServer from './server';

dbConnection();

startApolloServer(typeDefs, resolvers, context, formatError);





