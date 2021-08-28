import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  mongodbURL: process.env.MONGODB_URL,
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
};
