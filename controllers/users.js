import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import env from "../config/env.js";
import mongoose from "mongoose";
import { sendError, ErrorCodes } from "./../config/Errors.js";

import { validationResult } from "express-validator/check/index.js";

export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, ErrorCodes.invalidInput, errors.array());
    return;
  }
  const { password, email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      sendError(res, ErrorCodes.InvalidUser, "User does not exist");
      return;
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      sendError(
        res,
        ErrorCodes.InvalidCredentials,
        "Email or password are invalid"
      );
      return;
    }
    const jwtToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      env.jwtPrivateKey,
      { expiresIn: "1h" }
    );
    User.findOneAndUpdate(user._id, { isLoggedIn: true });
    res.status(200).json(jwtToken);
  } catch (error) {
    sendError(res, ErrorCodes.UnknownServerErr);
  }
};

export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, ErrorCodes.invalidInput, errors.array());
    return;
  }
  try {
    const userInDB = await User.findOne({ email });
    if (userInDB) {
      sendError(res, ErrorCodes.InvalidUser, "User already exists");
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 15);
    const user = await User.create({
      firstName,
      lastName,
      email,
      isLoggedIn: true,
      password: hashedPassword,
    });
    const jwtToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      env.jwtPrivateKey,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Account has been created",
      jwtToken,
    });
  } catch (error) {
    sendError(res, ErrorCodes.UnknownServerErr);
    return;
  }
};

export const getUser = async (req, res) => {
  const { _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return sendError(res, ErrorCodes.InvalidUser, "User does not exist");
  }
  try {
    const user = await User.findById(_id);
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (error) {
    sendError(res, ErrorCodes.UnknownServerErr);
    return;
  }
};
