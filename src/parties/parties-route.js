const express = require('express');
const PartiesService = require('./parties-service');
const { requireAuth } = require('../middleware/require-auth');

const partiesRouter = express.Router();
const jsonBodyParser = express.json();

partiesRouter
  .route('/')
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    let {
      party_name,
      players_needed,
      dm_needed,
      dnd_edition,
      about,
      language,
      online_or_not,
    } = req.body;
    let newParty = {
      party_name,
      players_needed,
      dm_needed,
      dnd_edition,
      about,
      language,
      online_or_not,
    };
    if (!party_name) {
      return res.status(400).json({ error: 'Missing Party Name' });
    }
    PartiesService.getPartyName(req.app.get('db'), party_name).then(
      (result) => {
        if (result) {
          return res.status(400).json({ error: 'Party Name is Already Taken' });
        } else {
          PartiesService.createParty(req.app.get('db'), newParty)
            .then((result) => {
              return res.status(201).send(result);
            })
            .catch(next);
        }
      }
    );
  })
  .get((req, res, next) => {
    PartiesService.getAllPartiesFromDB(req.app.get('db'))
      .then((result) => {
        return res.json(result);
      })
      .catch(next);
  });

module.exports = partiesRouter;
