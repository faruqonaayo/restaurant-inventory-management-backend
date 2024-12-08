// 3rd party modules
import express from "express";
import { body } from "express-validator";

// importing custom controllers
import * as authController from "../controllers/auth.js";

// express router app
const router = express.Router();

// routes middleware
// route to create a new user to be access the inventory
router.put(
  "/signup",
  [
    body("username")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Username should be a minimum of 2 characters"),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Password should be a minimum of 5 characters"),
  ],
  authController.putUser
);

router.post("/login", authController.postLogin);

export default router;
