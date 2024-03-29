const express = require("express");
const userRouter = express.Router();
const { LoginUser, CreateUser } = require('../controllers/userController');
const fileUpload = require("express-fileupload");

userRouter.use(fileUpload());

userRouter.post('/register', CreateUser);
userRouter.post('/login', LoginUser);

userRouter.post("/events", async (req, res) => {
  const { type } = req.body;

  console.log("UserAccMgmtServ: Received Event:", type);

  res.send({});
});

module.exports = {userRouter};