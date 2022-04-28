import Kill from '../models/Kill';
import Group from '../models/Group';
import User from '../models/User';
import { pubsub } from '../utils/pubsub';

const getKills = async() => {
  try {
    const kills = await Kill.find().populate('idUser').populate('idGroup');
    return kills;
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
  let newKill;
  
  const foundGroup = await Group.findById(killInput.idGroup).populate('author').populate('users');
  const totalKillInGroup = await getTotalKillsInGroup(foundGroup.id);

  const foundUser = await User.findById(id);
  if (killInput.low < 1) throw new Error('El valor debe ser mayor a 0');

  const totalKillPerUserInGroup = await getTotalKillsPerUserInGroup(foundUser.id, foundGroup.id);

  const arrayUsers = foundGroup.users.map( user => user.id);

  if (arrayUsers.includes(foundUser.id)) {
    try {
      newKill = new Kill(killInput);
      newKill.idUser = foundUser;
      newKill.idGroup = foundGroup;
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

const deleteKill = async(idKill, context) => {
  const {id} = context.user;
  let killDeleted;
  const foundKIll = await Kill.findById(idKill).populate('idUser').populate('idGroup');

  if (foundKIll.idUser.id !== id) throw new Error('No tienes permisos para eliminar este kill');

  try {
    killDeleted = await Kill.findByIdAndDelete(idKill);
    pubsub.publish('KILL_DELETED', { killDeleted });
    return killDeleted;
  } catch (error) {
    console.log(error);
  }

}

const getTotalKillsInGroup = async(idGroup) => {
  const groupKills = await Kill.find({idGroup}).populate('idUser').populate('idGroup');
  const kills = groupKills.map( kill => kill.low);
  const totalKills = kills.reduce((previousValue, currentValue) => previousValue + currentValue);
  // pubsub.publish('TOTAL_KILLS_IN_GROUP', { totalKillsInGroup: totalKills });
  return totalKills;
}

const getTotalKillsPerUser = async(idUser) => {
  const userKills = await Kill.find({idUser}).populate('idUser').populate('idGroup');
  const kills = userKills.map( kill => kill.low);
  const totalKills = kills.reduce((previousValue, currentValue) => previousValue + currentValue);
  return totalKills;
}

const getTotalKillsPerUserInGroup = async(idUser, idGroup) => {
  const arrayKills = [];
  const userKills = await Kill.find({idUser, idGroup}).populate('idUser').populate('idGroup');
  const kills = userKills.map( kill => kill.low);
  arrayKills.push(...kills);
  const totalKills = arrayKills.reduce((previousValue, currentValue) => previousValue + currentValue);

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
  getTotalKillsPerUserInGroup
}
