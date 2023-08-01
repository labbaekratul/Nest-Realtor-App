import * as jwt from 'jsonwebtoken';
import { tokenParams } from 'src/interface/mixin';

const secretKey = process.env.JWT_SECRET;

export const generateToken = async (payload: tokenParams) => {
  return await jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
