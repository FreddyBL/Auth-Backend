import jwt from "jsonwebtoken";
import env from "../../config/env.js";
import { ErrorCodes, sendError } from "../../config/Errors.js";
import { body } from "express-validator/check/index.js";

export const authUser = async (req, res, next) => {
  try {
    const jwtToken = req.headers.authorization;
    const decryptedCredentials = jwt.verify(jwtToken, env.jwtPrivateKey);
    req.userId = decryptedCredentials._id;
    next();
  } catch (error) {
    sendError(res, ErrorCodes.Unauthorized, "Invalid token");
  }
};

// For cases where
export const checkForAuthToken = async (req, res, next) => {
  try {
    const jwtToken = req.headers.authorization;
    req.hasAuthToken = false;
    if (jwtToken) {
      const decryptedCredentials = jwt.verify(jwtToken, env.jwtPrivateKey);
      req.userId = decryptedCredentials._id;
      req.hasAuthToken = true;
    }
    next();
  } catch (error) {
    sendError(res, ErrorCodes.Unauthorized, "Invalid");
  }
};

export const validateLogin = () => {
  return [
    body("email", "Invalid email").exists().isEmail().normalizeEmail(),
    body("password", "Invalid password").exists().not().isEmpty().escape(),
  ];
};
export const validateRegister = () => {
  return [
    body("firstName", "Invalid first name.").exists().not().isEmpty().escape(),
    body("lastName", "Invalid last name.").exists().not().isEmpty().escape(),
    body("email", "Invalid email").exists().isEmail().normalizeEmail(),
    body("password", "Invalid password").exists().not().isEmpty().escape(),
  ];
};
