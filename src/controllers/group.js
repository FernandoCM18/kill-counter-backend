import { validateGroup } from '../helpers/validate';
import { UserInputError } from 'apollo-server';
import Group from '../models/Group';
import Kill from '../models/Kill';
import { getTotalKillsPerUserInGroup } from './kill';

const getGroups = async() => {
  try {
    const groups = await Group.find().populate('author').populate('users');
    return groups;
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener los grupos', error);
  }
}

const getGroup = async(id, name) => {
  let group;
  if (id) group = await Group.findById(id).populate('author').populate('users');  
  if (name) group = await Group.findOne({name: {$regex: name, $options: 'i'}}).populate('author').populate('users');
  if (!group) throw new UserInputError('El grupo no existe');
  return group;
}

const createGroup = async(group, context) => {
  const {id} = context.user;
  const newGroup = group;
  await validateGroup(group, context);
  try {
    const group = new Group(newGroup);
    group.author = id;
    group.users = [id];
    group.save();
    return group;
  } catch (error) {
    console.log(error);
    throw new Error('Error al crear el grupo', error);
  }
}

const updateGroup = async(groupInput, context) => {
  const {id} = context.user;
  const foundGroup = await Group.findById(groupInput.id).populate('author');
  if (foundGroup.author.id !== id) throw new UserInputError('No tienes permisos para actualizar este grupo');
  return await Group.findByIdAndUpdate(foundGroup.id, groupInput, {new: true}).populate('author');
    
} 

const deleteGroup = async(idGroupInput, context) => {
  const {id} = context.user;
  const foundGroup = await Group.findById(idGroupInput).populate('author');
  if (foundGroup.author.id !== id) throw new UserInputError('No tienes permisos para actualizar este grupo');
  return await Group.findByIdAndDelete(foundGroup.id);
}

const addUserToGroup = async(addUserInput, context) => {
  const {id} = context.user;

  const foundGroup = await Group.findById(addUserInput.idGroup).populate('author');
  if (foundGroup.author.id !== id) throw new UserInputError('No tienes permisos para actualizar este grupo');
  const exists = foundGroup.users.includes(addUserInput.idUser);
  if (exists) throw new UserInputError('El usuario ya está en el grupo');

  if (foundGroup.users.find(user => user.id === addUserInput.idUser)) throw new UserInputError('El usuario ya está en el grupo');
  return await Group.findByIdAndUpdate(foundGroup.id, {$push: {users: addUserInput.idUser}}, {new: true}).populate('author').populate('users');
  
}

const deleteUserToGroup = async(deleteUserInput, context) => {
  const {id} = context.user;

  const foundGroup = await Group.findById(deleteUserInput.idGroup).populate('author');
  if (foundGroup.author.id !== id) throw new UserInputError('No tienes permisos para borrar usuarios en este grupo');
  const exists = foundGroup.users.includes(deleteUserInput.idUser);
  if (!exists) throw new UserInputError('El usuario no está en el grupo');
  if (deleteUserInput.idUser === id) throw new UserInputError('No puedes eliminarte a ti mismo');

  return await Group.findByIdAndUpdate(foundGroup.id, {$pull: {users: deleteUserInput.idUser}}, {new: true}).populate('author').populate('users');

}

const getUsersKill = async(group) => {
  const users = group.users;
  const arrayKillsUser = [];
  for await (const user of users) {
    const kills = await getTotalKillsPerUserInGroup(user, group.id);
    console.log(kills);
    arrayKillsUser.push(kills);
  }
  return arrayKillsUser;
}

export default {
  createGroup,
  deleteGroup,
  getGroup,
  getGroups,
  updateGroup,
  addUserToGroup,
  deleteUserToGroup,
  getUsersKill
}