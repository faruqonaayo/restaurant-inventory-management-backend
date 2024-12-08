import { validationResult } from "express-validator";

import User from "../models/user.js";

export async function putUser(req, res, next) {
  try {
    const { errors } = validationResult(req);

    if (errors.length > 0) {
      return res.status(422).json({
        message: errors[0].msg,
        statusCode: 422,
      });
    }

    const isUsernameExist = await User.findOne({ username: req.body.username });

    // checking if user name exists already
    if (isUsernameExist) {
      return res.status(409).json({
        message: "Username already exists",
        statusCode: 409,
      });
    }

    // creating new user account
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ message: "user created successfully", statusCode: 201 });
  } catch (error) {
    next(error);
  }
}

export async function postLogin(req, res, next) {
  try {
    const isUsernameExist = await User.findOne({ username: req.body.username });

    // checking if username exists and if the password match
    if (!isUsernameExist || isUsernameExist.password !== req.body.password) {
      return res.status(422).json({
        message: "Invalid username or password",
        statusCode: 422,
      });
    }

    return res.status(200).json({
      message: "Logged in sucessfully",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
}
