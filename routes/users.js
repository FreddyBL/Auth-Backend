import express from "express";
import * as api from "../controllers/users.js";
import * as mw from "../middleware/users/authUser.js";
import { body } from "express-validator/check/index.js";
const router = express.Router();
router.post("/login", mw.validateLogin(), api.loginUser);
router.post("/register", mw.validateRegister(), api.registerUser);
router.get("/account/:_id", mw.checkForAuthToken, api.getUser);

export default router;
