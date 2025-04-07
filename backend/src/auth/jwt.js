// src/auth/js
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secret123';

export const createToken = (userId, tokenId) => {
  return jwt.sign({ userId, tokenId }, SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
