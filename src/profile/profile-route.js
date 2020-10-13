const express = require('express');
const ProfileService = require('./profile-service');

const profileRouter = express.Router();
const jsonBodyParser = express.json();

profileRouter
  .route('/:user_id')
  .get((req, res, next) => {
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
      user_name,
      user_email,
      last_name,
      dnd_experience,
      location,
      languages,
      contact,
      about,
      preferred_editions,
      preferred_classes,
    } = req.body;
    const userInfo = {
      first_name,
      user_name,
      user_email,
      last_name,
      dnd_experience,
      location,
      languages,
      contact,
      about,
      preferred_editions,
      preferred_classes,
    };
    ProfileService.updateUserInfo(req.app.get('db'), userInfo, user_id)
      .then((result) => {
        return res.json(result);
      })
      .catch(next);
  });

profileRouter
  .route('/created_parties/:user_id')
  .get(jsonBodyParser, (req, res, next) => {
    const user_id = req.params.user_id;
    ProfileService.getUserCreatedTablesFromDB(req.app.get('db'), user_id)
      .then((result) => {
        return res.json(result);
      })
      .catch(next);
  });

module.exports = profileRouter;
