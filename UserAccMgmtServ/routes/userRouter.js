const express = require("express");
const userRouter = express.Router();
const multer = require('multer');
const upload = multer();
const { LoginUser, CreateUser } = require('../controllers/userController');

userRouter.post('/register', upload.none(), CreateUser);
userRouter.post('/login', upload.none(), LoginUser);

userRouter.post("/events", async (req, res) => {
  const { type } = req.body;

  console.log("UserAccMgmtServ: Received Event:", type);

//   if (type === "Blah Blah") {
//     await axios.request({
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: 'http://localhost:4002/createUser',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       data: req.body
//     }).catch((err) => {
//       console.log(err.message);
//     });
//   }

  res.send({});
});

module.exports = {userRouter};