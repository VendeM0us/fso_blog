import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import User from '../models/user.js';
import * as config from '../utils/config.js';

const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const correctPassword = _.isNull(user)
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && correctPassword)) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  const token = jwt.sign(
    {
      username: user.username,
      id: user._id,
    },
    config.SECRET_KEY,
    { expiresIn: 60 * 60 },
  );

  return res.json({
    token,
    username: user.username,
    name: user.name,
    id: user._id.toString(),
  });
});

export default loginRouter;
