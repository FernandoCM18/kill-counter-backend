import { UserInputError } from 'apollo-server';
import User from '../models/User';
import Group from '../models/Group';

export const validateUser = async (user, context) => {
  // const {name, email, username, password} = user;

  const foundEmail = await User.findOne({ email: user.email });
	if (foundEmail) throw new UserInputError('El email ya esta registrado', {
    invalidArgs: { email: user.email },
  });

	const foundUsername = await User.findOne({ username: user.username });
	if (foundUsername) throw new UserInputError('El username ya esta registrado', {
    invalidArgs: { username: user.username },
  });

	if (user.name.length < 2) throw new UserInputError('El name debe tener al menos 2 caracteres', {
    invalidArgs: { name: user.name },
  });

	if (user.username.length < 2) throw new UserInputError('El username debe tener al menos 2 caracteres', {
    invalidArgs: { username: user.username },
  });

	if (!user.password) throw new UserInputError('El password es requerido', {
    invalidArgs: { password: user.password },
  });

	if (user.password.length < 6) throw new UserInputError('El password debe tener al menos 5 caracteres', {
    invalidArgs: { password: user.password },
  });

}

export const validateGroup = async (group, context) => {
  const {id} = context.user;

  const foundName = await Group.findOne({ name: group.name });
  if (foundName) throw new UserInputError('El nombre ya esta registrado', {
    invalidArgs: { name: group.name },
  });

  if (group.name.length < 2) throw new UserInputError('El nombre debe tener al menos 2 caracteres', {
    invalidArgs: { name: group.name },
  });

  if (group.description.length < 2) throw new UserInputError('La descripcion debe tener al menos 2 caracteres', {
    invalidArgs: { description: group.description },
  });

}
