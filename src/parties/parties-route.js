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
      dnd_edition,
      about,
      language,
      online_or_not,
      homebrew_rules,
      time_of_event,
      classes_needed,
      group_personality,
      campaign_or_custom,
      dm_needed,
      camera_required,
    } = req.body;
    let newParty = {
      party_name,
      players_needed,
      dnd_edition,
      about,
      language,
      online_or_not,
      homebrew_rules,
      time_of_event,
      classes_needed,
      group_personality,
      campaign_or_custom,
      dm_needed,
      camera_required,
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
    PartiesService.checkPartyRequest(req.app.get('db'), newRequest)
      .then((alreadyRequested) => {
        if (!alreadyRequested) {
          PartiesService.checkPartyJoined(req.app.get('db'), newRequest).then(
            (alreadyJoined) => {
              if (!alreadyJoined) {
                PartiesService.createPartyRequest(req.app.get('db'), newRequest)
                  .then((result) => {
                    return res.status(201).send(result);
                  })
                  .catch(next);
              } else {
                return res.end();
              }
            }
          );
        } else {
          return res.end();
        }
      })
      .catch(next);
  });

partiesRouter.route('/joined').post(jsonBodyParser, (req, res, next) => {
  const party_id = req.body.party_id;
  PartiesService.getUsersJoinedParties(req.app.get('db'), party_id)
    .then((result) => {
      return res.json(result);
    })
    .catch(next);
});

partiesRouter.route('/joined/:user_id').get(requireAuth, (req, res, next) => {
  const user_id = req.params.user_id;
  PartiesService.getUserJoinedParties(req.app.get('db'), user_id)
    .then((result) => {
      return res.json(result);
    })
    .catch(next);
});

partiesRouter
  .route('/accept_request')
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const type = req.body.type;
    const requester = {
      user_id: req.body.user_id,
      party_id: req.body.party_id,
    };
    if (type === 'player') {
      PartiesService.acceptUserToParty(req.app.get('db'), requester, type)
        .then(() => {
          PartiesService.decreasePlayersNeeded(
            req.app.get('db'),
            requester.party_id
          ).then((result) => {
            return res.json(result);
          });
        })
        .catch(next);
    } else if (type === 'dm') {
      PartiesService.acceptDMToParty(req.app.get('db'), requester)
        .then((result) => {
          return res.json(result);
        })
        .catch(next);
    }
  });

partiesRouter.route('/requests').post(jsonBodyParser, (req, res, next) => {
  PartiesService.getAllPartyRequests(req.app.get('db'), req.body.party_id)
    .then((result) => {
      return res.json(result);
    })
    .catch(next);
});

module.exports = partiesRouter;
