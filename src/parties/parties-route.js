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
      user_id_creator: req.user.user_id,
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

partiesRouter.route('/:party_id').get((req, res, next) => {
  const party_id = req.params.party_id;
  PartiesService.getIndividualPartyFromDB(req.app.get('db'), party_id)
    .then((result) => {
      return res.json(result);
    })
    .catch(next);
});
partiesRouter
  .route('/join')
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const newRequest = {
      user_id: req.user.user_id,
      party_id: req.body.party_id,
    };
    PartiesService.createPartyRequest(req.app.get('db'), newRequest)
      .then((result) => {
        return res.status(201).send(result);
      })
      .catch(next);
  });

partiesRouter
  .route('/joined')
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const party_id = req.body.party_id;
    PartiesService.getJoinedParty(req.app.get('db'), party_id).then(
      (result) => {
        return res.json(result);
      }
    );
  });

partiesRouter
  .route('/accept_request')
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const requester = {
      user_id: req.body.user_id,
      party_id: req.body.party_id,
    };
    PartiesService.acceptUserToParty(req.app.get('db'), requester)
      .then((result) => {
        return res.json(result);
      })
      .catch(next);
  });

partiesRouter
  .route('/requests')
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    PartiesService.getAllPartyRequests(req.app.get('db'), req.body.party_id)
      .then((result) => {
        return res.json(result);
      })
      .catch(next);
  });

module.exports = partiesRouter;
