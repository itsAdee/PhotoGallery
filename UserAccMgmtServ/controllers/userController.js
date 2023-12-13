
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');


const CreateUser = async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, email });
  await newUser.save();
  console.log(`User ${username} created.`);
  res.status(201).json(newUser);
};

const LoginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && bcrypt.compare(password, user.password)) {
    console.log(`User ${username} logged in.`);
    res.status(200).json(user);
  } else {
    console.log(`User ${username} failed to log in.`);
    res.status(403).send();
  }
};

module.exports = {
  CreateUser,
  LoginUser,
};