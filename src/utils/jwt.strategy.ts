import * as jwt from 'jsonwebtoken';
import { UserInterceptInfo, tokenParams } from 'src/interface/mixin';

const secretKey = process.env.JWT_SECRET;

export const generateToken = async (payload: tokenParams) => {
  return await jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export const decodeToken = async (token: string) => {
  return await jwt.decode(token);
};

export const verifyToken = async (
  token: string,
): Promise<UserInterceptInfo | null> => {
  try {
    const user = (await jwt.verify(token, secretKey)) as UserInterceptInfo;
    if (!user || !user.name) return null;
    return user;
  } catch (error) {
    return null;
  }
};
