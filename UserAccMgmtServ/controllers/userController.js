const bcrypt = require('bcrypt');
const User = require('../models/user');
const axios = require('axios');
const {generateToken} = require('./WebToken');
const CreateUser = async (req, res) => {
  const { username, password, confirmPassword, email } = req.body;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  console.log(req.body);

  if (!username || !password || !confirmPassword || !email) {
    console.log(`Username, password, email, or confirm password not provided.`);
    res.status(400).send({ message: `Username, password, email, or confirm password not provided.` });
    return;
  } else if (!passwordRegex.test(password)) {
    console.log(`Password does not meet the requirements.`);
    res.status(400).send({ message: `Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long.` });
    return;
  } else if (password !== confirmPassword) {
    console.log(`Passwords do not match.`);
    res.status(400).send({ message: `Passwords do not match.` });
    return;
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (user) {
    console.log(`User ${username} or email ${email} already exists.`);
    res.status(400).send({ message: `User ${username} or email ${email} already exists.` });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();
    console.log(`User ${username} created.`);
    generatedToken = generateToken(newUser);
    console.log(generatedToken);

    // Send event to EventBus
    await axios.request({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:4000/api/eventbus/events',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        type: "NewUserCreated",
        userID: newUser._id
      })
    }).then((response) => {
      console.log(JSON.stringify(response.data));
    }).catch((error) => {
      console.log(error);
    });

    newUser.password = undefined;
    response = {
      token: generatedToken,
      username: newUser.username,
    }

    res.status(201).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

const LoginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    console.log(`Username or password not provided.`);
    res.status(400).send({ message: `Username or password not provided.` });
    return;
  }

  const user = await User.findOne({ username });

  if (!user) {
    console.log(`User ${username} not found.`);
    res.status(404).send({ message: `User ${username} not found.` });
    return;
  }

  const auth = await bcrypt.compare(password, user.password);

  if (!auth) {
    console.log(`Incorrect password for user ${username}.`);
    res.status(403).send({ message: `User ${username} failed to log in.` });
    return;
  }

  console.log(`User ${username} logged in.`);

  webtoken = generateToken(user);

  user.password = undefined;
  console.log(user);
  response = {
    token: webtoken,
    username: user.username,
  }
  res.status(200).json(response);
};

module.exports = {
  CreateUser,
  LoginUser,
};