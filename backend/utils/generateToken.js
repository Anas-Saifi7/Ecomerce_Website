import jwt from 'jsonwebtoken';

const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign({ id: userId, role }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export default generateToken;
