import { AuthenticationError } from 'apollo-server'
import User from './models/User';
import { getAuthIdFromJWT } from './utils/auth';
import { ObjectId } from 'mongodb';


export default async({req}) => {
  const context = {};
  const token = req.headers.authorization;
  let authId;
  if (token) {
    try {
      authId = await getAuthIdFromJWT(token.replace('Bearer ', ''));
    } catch (e) {
      let message;
      if (e.message.includes('jwt expired')) message = 'jwt expired';
      if (e.message.includes('jwt malformed')) message = 'jwt malformed';
      throw new AuthenticationError(message);
    }
    const user = await User.findById(ObjectId(authId));
    if (user) {
      context.user = user;
    } else {
      throw new AuthenticationError('no such user');
    }
  }

  return context;
  // const authId = await getAuthIdFromJWT(token.replace('Bearer ', ''));
  // context.user = authId;
  // return context;
}