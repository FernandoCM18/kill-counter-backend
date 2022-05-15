import userController from '../controllers/user';


export default {
  Query: {
    me: (_, __, context) => userController.me(context),
    users: () => userController.getUsers(),
    user: (_, {id, username}) => userController.getUser(id, username),
    search: (_, { search }) => userController.search(search),
  },
  User: {
    id: ({ _id }) => _id,
    groups: (user) => userController.getMyGroups(user),
  },
  Mutation: {
    createUser: (_, {user}) => userController.createUser(user),
    updateUser: (_, {user}, context) => userController.updateUser(user, context),
    login: (_, {email, password}) => userController.login(email, password)
  }
};