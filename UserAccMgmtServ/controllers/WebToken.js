require("dotenv").config();
const jwt = require('jsonwebtoken');


function generateToken(user) {
  const payload = {
    username: user.username,
    password: user.password,
    email:user.email,
    id: user._id
  };

  return jwt.sign(payload,process.env.SECRET_KEY, { expiresIn: '1h' });
}


const verifyToken = (req, res) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(403).send({ message: 'No token provided.' });
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(500).send({ message: 'Failed to authenticate token.' });
      }
  
      res.status(200).send({ user: decoded });
    });
  }
module.exports = { generateToken , verifyToken};