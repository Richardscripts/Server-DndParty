const express = require('express');
const bcrypt = require('bcryptjs');
const edc = require('email-domain-check');
const AuthService = require('./auth-service');

//const { requireAuth } = require('../middleware/require-auth');

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter.route('/register').post(jsonBodyParser, (req, res, next) => {
  let { user_email, password } = req.body;
  let newUser = { user_email, password };
  if (!user_email || !password) {
    res.status(400).json({ error: 'Bad Request - Missing Credentials' });
  }
  if (password.length < 8 || password.length > 72) {
    res.status(400).json({
      error:
        'Password must be atleast 8 characters and less than 72 characters',
    });
  }
  edc(user_email)
    .then((result) => {
      if (!result) {
        res.status(400).json({ error: 'Invalid Email' });
      }
    })
    .then(() => {
      newUser.password = bcrypt.hashSync(password);
      AuthService.getUserEmail(req.app.get('db'), user_email).then((result) => {
        if (!result) {
          AuthService.registerUser(req.app.get('db'), newUser)
            .then((user) => {
              res.status(201).send({
                authToken: AuthService.createJwt(user.user_email, {
                  user_id: user.user_id,
                }),
              });
            })
            .catch(next);
        } else {
          res.status(400).json({ error: 'Email Already Exists' });
        }
      });
    });
});

authRouter.post('/login', jsonBodyParser, (req, res, next) => {
  const { user_email, password } = req.body;
  const loginUser = { user_email, password };

  for (const [key, value] of Object.entries(loginUser))
    if (!value)
      return res.status(400).json({
        error: `Missing '${key}' in request`,
      });
  AuthService.getUserEmail(req.app.get('db'), loginUser.user_email)
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
        const sub = dbUser.user_email;
        const payload = { user_id: dbUser.id };
        res.send({
          authToken: AuthService.createJwt(sub, payload),
        });
      });
    })

    .catch(next);
});

module.exports = authRouter;
