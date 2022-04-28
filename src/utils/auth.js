import jwt from 'jsonwebtoken';

export const getAuthIdFromJWT = async(token) => {
  if (!token) return;
  const verifiedToken = await jwt.verify(token, process.env.SECRET_JWT_SEED);
  return verifiedToken;
}

export const generateAuthToken = (user) => {
  const { id, name, username, email } = user;
  const payload = {
    id,
    name,
    username,
    email
  };
  return jwt.sign(payload, process.env.SECRET_JWT_SEED, {expiresIn: '24h'});
}