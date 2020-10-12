const express = require('express');
const ProfileService = require('./profile-service');

//const { requireAuth } = require('../middleware/require-auth');

const profileRouter = express.Router();
const jsonBodyParser = express.json();

profileRouter
  .route('/:user_id')
  .post(jsonBodyParser, (req, res, next) => {
    const user_id = req.params.user_id;

    ProfileService.getUserInfoFromDB(req.app.get('db'), user_id)
      .then((result) => {
        return res.json(result);
      })
      .catch(next);
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const user_id = req.params.user_id;
    const {
      first_name,
      last_name,
      dnd_experience,
      location,
      languages,
      about,
      preferred_editions,
      preferred_classes,
    } = req.body;
    const userInfo = {
      first_name,
      last_name,
      dnd_experience,
      location,
      languages,
      about,
      preferred_editions,
      preferred_classes,
    };
    ProfileService.updateUserInfo(req.app.get('db'), userInfo, user_id).then(
      (result) => {
        console.log(result);
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
