require("dotenv").config();
const jwt = require('jsonwebtoken');
 const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(403).send({ message: 'No token provided.' });
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(201).send({ message: 'Failed to authenticate token.' });
      }

      console.log("Decoded: ", decoded.id);
  
     req.params.userID = decoded.id;
        next();
    });
  }

  module.exports = verifyToken;