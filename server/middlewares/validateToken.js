import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.SECRET_KEY;

export const validateJWT = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        msg: 'Access denied, no token provided',
      });
    }

    const token = authHeader.split(' ')[1]; // extract token part

    const payload = jwt.verify(token, secretKey);

    req.userId = payload.id; // store user ID for use in routes
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      ok: false,
      msg: 'Token not valid',
    });
  }
};
