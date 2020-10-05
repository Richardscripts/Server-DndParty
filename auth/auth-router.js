const express = require('express');
const path = require('path');
const AuthService = require('./auth-service');
//const requireAuth = require('../middleware/basic-auth');

const AuthRouter = express.Router();
const jsonBodyParser = express.json();

AuthRouter.route('/')
  //.all(requireAuth)
  .post(jsonBodyParser, (req, res, next) => {
    console.log('Working');
    const { user_name, password } = req.body;
    const newUser = { user_name, password };
    // for (const [key, value] of Object.entries(newUser))
    //   if (value == null)
    //     return res.status(400).json({
    //       error: `Missing '${key}' in request body`,
    //     });
    AuthService.registerUser(req.app.get('db'), newUser)
      .then((result) => {
        res.status(201).json(result);
      })
      .catch(next);
  });

module.exports = AuthRouter;
