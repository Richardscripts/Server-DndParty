const express = require('express');
const ProfileService = require('./profile-service');
const { requireAuth } = require('../middleware/require-auth');
const serializeData = require('../serializeData/serializeData');

const profileRouter = express.Router();
const jsonBodyParser = express.json();

profileRouter
  .route('/:user_id')
  .get((req, res, next) => {
    const user_id = req.params.user_id;
    ProfileService.getUserInfoFromDB(req.app.get('db'), user_id)
      .then((result) => {
        return res.json(serializeData(result));
      })
      .catch(next);
  })
  .patch(requireAuth, jsonBodyParser, (req, res, next) => {
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
      about_me,
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
      about_me,
      preferred_editions,
      preferred_classes,
    };
    ProfileService.checkUsernameExists(req.app.get('db'), user_name)
      .then((result) => {
        if (result) {
          return res.status(400).json({ error: 'Nickname already exists' });
        }
        ProfileService.updateUserInfo(req.app.get('db'), userInfo, user_id)
          .then((result) => {
            return res.status(200).json(result.map(serializeData));
          })
          .catch(next);
      })
      .catch(next);
  });

profileRouter
  .route('/created_parties/:user_id')
  .get(jsonBodyParser, (req, res, next) => {
    const user_id = req.params.user_id;
    ProfileService.getUserCreatedTablesFromDB(req.app.get('db'), user_id)
      .then((result) => {
        return res.json(result.map(serializeData));
      })
      .catch(next);
  });

module.exports = profileRouter;
