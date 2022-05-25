import Kill from '../models/Kill';
import Group from '../models/Group';
import User from '../models/User';
import { pubsub } from '../utils/pubsub';
import { UserInputError } from 'apollo-server-core';
import { isObjEmpty } from '../helpers/validate';

const MAX_PAGE_SIZE = async() => {
  return await Kill.find().countDocuments();
}

const getKills = async(idGroup, skip, limit) => {
  const MAX_LIMIT = await MAX_PAGE_SIZE();
  const errors = {};
  if (skip < 0) {
    errors.skip = 'El valor no puede ser negativo';
  }

  if (limit < 0) {
    errors.limit = 'El valor no puede ser negativo';
  }

  if (limit < 1) {
    errors.limit = 'El valor debe ser mayor a 0';
  }

  // if (limit > MAX_LIMIT) {
  //   errors.limit = 'El valor no puede ser mayor a ' + MAX_LIMIT;
  // }

  if (!isObjEmpty(errors)) {
    throw new UserInputError('kill', {
      invalidArgs: {errors}
    });
  }

  try {
    if (idGroup) {
      const kills = await Kill.find({idGroup})
        .populate('idUser')
        .populate('idGroup')
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit);
      return kills;
    } else {
      const kills = await Kill.find()
        .populate('idUser')
        .populate('idGroup')
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit);
      return kills;
    }
  } catch (error) {
    console.log(error);
  }
}

const getKill = async(id) => {
  try {
    const kill = await Kill.findById(id).populate('idUser').populate('idGroup');
    return kill;
  } catch (error) {
    console.log(error);
  }
}

const createKill = async(killInput, context) => {
  const {id} = context.user;
  const foundUser = await User.findById(id);
  let newKill;
  
  const foundGroup = await Group.findById(killInput.idGroup).populate('author').populate('users');  
  if (killInput.low < 1) throw new Error('El valor debe ser mayor a 0');
  
  const totalKillPerUserInGroup = await getTotalKillsPerUserInGroup(foundUser.id, foundGroup.id);
  const totalKillInGroup = await getTotalKillsInGroup(foundGroup.id);
  
  const arrayUsers = foundGroup.users.map( user => user.id);

  if (arrayUsers.includes(foundUser.id)) {
    try {
      newKill = new Kill(killInput);
      newKill.idUser = foundUser;
      newKill.idGroup = foundGroup;
      newKill.createdAt = new Date();
      pubsub.publish('KILL_CREATED', { killCreated: newKill});
      newKill.save();
      pubsub.publish('TOTAL_KILLS_IN_GROUP', { totalKillsInGroup: totalKillInGroup + newKill.low });
      pubsub.publish('TOTAL_KILLS_PER_USER_IN_GROUP', { totalKillsPerUserInGroup: {
        user: foundUser,
        kills: totalKillPerUserInGroup.kills + newKill.low
      }});
      

      return newKill
      
    } catch (error) {
      console.log(error);
    }
    
  } else {
    throw new Error('No eres miembro de este grupo');
  }

}

const updateKill = async(killInput, context) => {
  const {id} = context.user;
  let killUpdated;

  const foundKill = await Kill.findById(killInput.id).populate('idUser').populate('idGroup');
  if (foundKill.idUser.id !== id) throw new Error('No tienes permisos para actualizar este kill');

  try {
    killUpdated =  await Kill.findByIdAndUpdate(foundKill.id, killInput, {new: true}).populate('idUser').populate('idGroup');
    pubsub.publish('KILL_UPDATED', { killUpdated });
    return killUpdated;
  } catch (error) {
    console.log(error);
  }
}

const deleteKill = async(killInput, context) => {
  const {id} = context.user;
  let killDeleted;

  const totalKillPerUserInGroup = await getTotalKillsPerUserInGroup(id, killInput.idGroup);
  const totalKillInGroup = await getTotalKillsInGroup(killInput.idGroup);

  const foundKIll = await Kill.findById(killInput.id).populate('idUser').populate('idGroup');
  console.log(foundKIll);

  if (foundKIll.idUser.id !== id) throw new Error('No tienes permisos para eliminar este kill');

  try {
    killDeleted = await Kill.findByIdAndDelete(killInput.id);
    pubsub.publish('KILL_DELETED', { killDeleted });
    pubsub.publish('TOTAL_KILLS_IN_GROUP', { totalKillsInGroup: totalKillInGroup - killDeleted.low });
    pubsub.publish('TOTAL_KILLS_PER_USER_IN_GROUP', { totalKillsPerUserInGroup: {
      user: context.user,
      kills: totalKillPerUserInGroup.kills - killDeleted.low
    }});

    return killDeleted;
  } catch (error) {
    console.log(error);
  }

}

export const getTotalKillsInGroup = async(idGroup) => {
  const groupKills = await Kill.find({idGroup}).populate('idUser').populate('idGroup');
  const kills = groupKills.map( kill => kill.low);
  const totalKills = kills.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  pubsub.publish('TOTAL_KILLS_IN_GROUP', { totalKillsInGroup: totalKills });
  return totalKills;
}

export const getTotalKillsPerUser = async(idUser) => {
  let totalKills = 0;
  const userKills = await Kill.find({idUser}).populate('idUser').populate('idGroup');
  if (userKills.length > 0) {
    const kills = userKills.map( kill => kill.low);
    totalKills = kills.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  }
  return totalKills;
}

export const getTotalKillsPerUserInGroup = async(idUser, idGroup) => {
  const arrayKills = [];
  const userKills = await Kill.find({idUser, idGroup}).populate('idUser').populate('idGroup');
  const kills = userKills.map( kill => kill.low);
  arrayKills.push(...kills);
  const totalKills = arrayKills.reduce((previousValue, currentValue) => previousValue + currentValue, 0);

  return {
    user: userKills[0].idUser,
    kills: totalKills
  }
  
}

export default {
  createKill,
  getKills,
  getKill,
  updateKill,
  deleteKill,
  getTotalKillsInGroup,
  getTotalKillsPerUser,
  getTotalKillsPerUserInGroup,
}
