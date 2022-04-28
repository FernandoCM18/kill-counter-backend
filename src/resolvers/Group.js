import groupController from '../controllers/group';

export default {
  Query: {
    groups: () => groupController.getGroups(),
    group: (_, {id, name}) => groupController.getGroup(id, name)
  },
  Mutation: {
    createGroup: (_, { groupInput }, context) => groupController.createGroup(groupInput, context),
    updateGroup: (_, { groupInput }, context) => groupController.updateGroup(groupInput, context),
    deleteGroup: (_, { idGroupInput }, context) => groupController.deleteGroup(idGroupInput, context),
    addUserToGroup: (_, { addUserInput }, context ) => groupController.addUserToGroup(addUserInput, context),
    deleteUserToGroup: (_, { deleteUserInput }, context ) => groupController.deleteUserToGroup(deleteUserInput, context),
  }
}
