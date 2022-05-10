import killController from '../controllers/kill';
import { pubsub } from '../utils/pubsub';

export default {
  Query: {
    kills: (_, { idGroup }) => killController.getKills(idGroup),
    kill: (_, { id }) => killController.getKill(id),
    totalKillsInGroup: (_, { idGroup}) => killController.getTotalKillsInGroup(idGroup),
    totalKillsPerUser: (_, { idUser }) => killController.getTotalKillsPerUser(idUser),
    totalKillsPerUserInGroup: (_, { idUser, idGroup }) => killController.getTotalKillsPerUserInGroup(idUser, idGroup),
    totalKillsPerUsersInGroup: (_, { idGroup }) => killController.getTotalKillsPerUsersInGroup(idGroup),
  },
  Mutation: {
    createKill: (_, { killInput }, context) => killController.createKill(killInput, context),  
    updateKill: (_, {killInput}, context) => killController.updateKill(killInput, context),
    deleteKill: (_, {idKill}, context) => killController.deleteKill(idKill, context),
  },
  Subscription: {
    killCreated: {
      subscribe: () => pubsub.asyncIterator([ 'KILL_CREATED' ]),
    },
    killUpdated: {
      subscribe: () => pubsub.asyncIterator([ 'KILL_UPDATED' ]),
    },
    KillDeleted: {
      subscribe: () => pubsub.asyncIterator([ 'KILL_DELETED' ]),
    },
    totalKillsInGroup: {
      subscribe: () => pubsub.asyncIterator([ 'TOTAL_KILLS_IN_GROUP' ]),
    },
    totalKillsPerUserInGroup: {
      subscribe: () => pubsub.asyncIterator([ 'TOTAL_KILLS_PER_USER_IN_GROUP' ]),
    }
    // subscribe: () => pubsub.asyncIterator([ 'TOTOAL_KILLS_PER_USER' ]),
  }
}