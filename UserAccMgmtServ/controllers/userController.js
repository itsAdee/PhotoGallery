const bcrypt = require('bcrypt');
const User = require('../models/user');
const axios = require('axios');


const CreateUser = async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, email });
  await newUser.save();
  console.log(`User ${username} created.`);

  // Send event to EventBus
  let data = JSON.stringify({
    "type": "NewUserCreated",
    "userID": newUser._id
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:4000/events',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });

  res.status(201).json(newUser);
};

const LoginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && bcrypt.compare(password, user.password)) {
    console.log(`User ${username} logged in.`);

    user.password = undefined;
    console.log(user);
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