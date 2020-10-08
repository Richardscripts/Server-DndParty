const express = require('express');
const ProfileService = require('./profile-service');

//const { requireAuth } = require('../middleware/require-auth');

const profileRouter = express.Router();
const jsonBodyParser = express.json();

profileRouter.route('/:user_id').post(jsonBodyParser, (req, res, next) => {
  const user_id = req.params.user_id;

  ProfileService.getUserInfoFromDB(req.app.get('db'), user_id).then(
    (result) => {
      return res.json(result);
    }
  );
});

profileRouter
  .route('/created_parties/:user_id')
  .post(jsonBodyParser, (req, res, next) => {
    const user_id = req.params.user_id;

    ProfileService.getUserCreatedTablesFromDB(req.app.get('db'), user_id).then(
      (result) => {
        return res.json(result);
      }
    );
  });

module.exports = profileRouter;
