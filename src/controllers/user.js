import { UserInputError } from 'apollo-server';
import bcrypt from 'bcryptjs';
import { generateAuthToken } from '../utils/auth';

import User from '../models/User';
import { validateUser } from '../helpers/validate';
import { getGroups } from './group';
import Group from '../models/Group';
import Kill from '../models/Kill';
import { getTotalKillsPerUser } from './kill';

const me = async (context) => {
	return await context.user;
};

const getUsers = async () => {
	return await User.find();
};

const getUser = async (id, username) => {
	let user;

	if (id) user = await User.findById(id);
	if (username) user = await User.findOne({ username });

	if (!user) throw new UserInputError('El usuario no existe');

	return user;
};

const createUser = async (user) => {
	const newUser = user;
	newUser.email = newUser.email.toLowerCase();

	await validateUser(user);

	const salt = await bcrypt.genSaltSync(10);
	newUser.password = await bcrypt.hashSync(newUser.password, salt);

	try {
		const user = new User(newUser);
		user.save();
		const token = generateAuthToken(user);
		return {
			token
		};
	} catch (error) {
		console.log(error);
		throw new Error('Error al crear el usuario', error);
	}
};

const updateUser = async(userInput, context) => {
	const { id } = context.user; 

	await validateUser(userInput, true);

  if (userInput.password && userInput.newPassword) {
    const userFound = await User.findById(id);
    const isPasswordCorrect = await bcrypt.compareSync(userInput.password, userFound.password);

    if (!isPasswordCorrect) throw new UserInputError('El password es incorrecto', {
      invalidArgs: { password: userInput.password },
    });

		if (userInput.newPassword.length < 6) throw new UserInputError('El nuevo password debe tener al menos 5 caracteres', {
			invalidArgs: { password: userInput.newPassword },
		});

    const salt = await bcrypt.genSaltSync(10);
    const newPasswordCrypt = await bcrypt.hashSync(userInput.newPassword, salt);

    return await User.findByIdAndUpdate(id, {password: newPasswordCrypt}, {new: true});

  } else {
    if (userInput.password) throw new UserInputError('Debes de agregar el nuevo password', {
      invalidArgs: { password: userInput.password },
    });

    if (userInput.newPassword) throw new UserInputError('Debes de agregar el password actual', {
      invalidArgs: { password: userInput.newPassword },
    });		
		return await User.findByIdAndUpdate(id, userInput, {new: true});
  }

};

const login = async (email, password) => {
	const userFound = await User.findOne({ email: email.toLowerCase() });
	if (!userFound) throw new Error('El email no esta registrado');

	const isPasswordCorrect = await bcrypt.compareSync(password, userFound.password);
	if (!isPasswordCorrect) throw new Error('El password es incorrecto');

	const token = generateAuthToken(userFound);

	return {
		token,
	};
};

const getMyGroups = async (user) => {
	return await Group.find({ users: user.id}).populate('author').populate('users');
}

const search = async (search) => {
	const users = await User.find({
		username: { $regex: search, $options: 'i' }
	});

	if (users.length === 0) throw new Error('No se encontraron usuarios');
	
	return users;
}

const getTotalKills = async (user) => {
	return await getTotalKillsPerUser(user.id);
}


export default {
	createUser,
	getUser,
	getUsers,
	login,
	me,
	updateUser,
	getMyGroups,
	search,
	getTotalKills
};
