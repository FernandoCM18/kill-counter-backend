const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  }
}

import User from './User';
import Group from './Group';
import Kill from './Kill';

export default [resolvers, User, Group, Kill];