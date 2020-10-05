const express = require('express');
const bcrypt = require('bcryptjs');
const AuthService = require('./auth-service');
//const { requireAuth } = require('../middleware/require-auth');

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter.route('/register').post(jsonBodyParser, (req, res, next) => {
  let { user_name, password } = req.body;
  let newUser = { user_name, password };
  if (!user_name || !password) {
    res.status(400).json({ error: 'Bad Request - Missing Credentials' });
  }
  newUser.password = bcrypt.hashSync(password);
  AuthService.getUserWithUserName(req.app.get('db'), user_name).then(
    (result) => {
      if (!result) {
        AuthService.registerUser(req.app.get('db'), newUser)
          .then((user) => {
            res.status(201).send({
              authToken: AuthService.createJwt(user.user_name, {
                user_id: user.user_id,
              }),
            });
          })
          .catch(next);
      } else {
        res.status(400).json({ error: 'Username Already Exists' });
      }
    }
  );
});

authRouter.post('/login', jsonBodyParser, (req, res, next) => {
  const { user_name, password } = req.body;
  const loginUser = { user_name, password };

  for (const [key, value] of Object.entries(loginUser))
    if (!value)
      return res.status(400).json({
        error: `Missing '${key}' in request`,
      });
  AuthService.getUserWithUserName(req.app.get('db'), loginUser.user_name)
    .then((dbUser) => {
      if (!dbUser)
        return res.status(400).json({
          error: 'Invalid Credentials',
        });
      return AuthService.comparePasswords(
        loginUser.password,
        dbUser.password
      ).then((compareMatch) => {
        if (!compareMatch)
          return res.status(400).json({
            error: 'Invalid Credentials',
          });
        const sub = dbUser.user_name;
        const payload = { user_id: dbUser.id };
        res.send({
          authToken: AuthService.createJwt(sub, payload),
        });
      });
    })

    .catch(next);
});

module.exports = authRouter;
