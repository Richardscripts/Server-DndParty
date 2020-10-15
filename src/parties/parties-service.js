const PartiesService = {
  createParty(db, newParty) {
    return db('parties')
      .insert(newParty)
      .returning('*')
      .then(([res]) => res);
  },
  getPartyName(db, party_name) {
    return db('parties').where({ party_name }).first();
  },
  getAllPartiesFromDB(db) {
    return db('parties').select('*');
  },
  getIndividualPartyFromDB(db, party_id) {
    return db('parties')
      .select('*', 'users.user_name')
      .join('users', function () {
        this.on('parties.user_id_creator', '=', 'users.user_id');
      })
      .where({ 'parties.party_id': party_id })
      .then((res) => {
        delete res[0].password;
        delete res[0].user_email;
        delete res[0].user_id;
        return res;
      });
  },
  getUsersJoinedParties(db, party_id) {
    return db('partyusers')
      .select('user_name', 'partyusers.user_id')
      .join('users', function () {
        this.on('users.user_id', '=', 'partyusers.user_id');
      })
      .where({ 'partyusers.party_id': party_id });
  },
  getUserJoinedParties(db, user_id) {
    return db('parties')
      .select('parties.party_name', 'parties.party_id')
      .join('partyusers', function () {
        this.on('parties.party_id', '=', 'partyusers.party_id');
      })
      .where({ 'partyusers.user_id': user_id })
      .then((res) => {
        return res;
      });
  },
  checkPartyRequest(db, newRequest) {
    return db('partyrequests').where(newRequest).first();
  },
  checkPartyJoined(db, newRequest) {
    return db('partyusers').where(newRequest).first();
  },
  createPartyRequest(db, newRequest) {
    return db('partyrequests')
      .insert(newRequest)
      .then((res) => res);
  },
  getAllPartyRequests(db, party_id) {
    return db('users')
      .select('user_name', 'users.user_id')
      .join('partyrequests', function () {
        this.on('users.user_id', '=', 'partyrequests.user_id');
      })
      .where({ 'partyrequests.party_id': party_id });
  },
  updatePartyusersTable(db, newUserParty) {
    return db('partyusers').insert(newUserParty);
  },
  updatePartycreatorsTable(db, newCreator) {
    return db('partycreators').insert(newCreator);
  },
  acceptUserToParty(db, requesterToJoin) {
    return db('partyrequests')
      .where(requesterToJoin)
      .del()
      .then(() => {
        return db('partyusers')
          .insert(requesterToJoin)
          .returning('*')
          .then((res) => {
            return res;
          });
      });
  },
  acceptDMToParty(db, requesterToJoin) {
    return db('parties')
      .where({ party_id: requesterToJoin.party_id })
      .first()
      .then((party) => {
        if (!party.players_needed) {
          return db('parties')
            .where({ party_id: requesterToJoin.party_id })
            .update({ dm_needed: false, party_complete: 'Complete Party!' })
            .then(() => {
              return db('partyrequests')
                .where(requesterToJoin)
                .del()
                .then(() => {
                  return db('partyusers')
                    .insert(requesterToJoin)
                    .returning('*')
                    .then((res) => {
                      return res;
                    });
                });
            });
        } else {
          return db('parties')
            .where({ party_id: requesterToJoin.party_id })
            .update({ dm_needed: false })
            .then(() => {
              return db('partyrequests')
                .where(requesterToJoin)
                .del()
                .then(() => {
                  return db('partyusers')
                    .insert(requesterToJoin)
                    .returning('*')
                    .then((res) => {
                      return res;
                    });
                });
            });
        }
      });
  },
  decreasePlayersNeeded(db, party_id) {
    return db('parties')
      .where({ 'parties.party_id': party_id })
      .first()
      .then((results) => {
        if (results.players_needed > 0) {
          results.players_needed = Number(results.players_needed) - 1;
          return results;
        } else {
          return results;
        }
      })
      .then((results) => {
        if (results.players_needed === 0 && !results.dm_needed) {
          return db('parties').where({ 'parties.party_id': party_id }).update({
            players_needed: results.players_needed,
            party_complete: 'Complete Party!',
          });
        } else if (results.players_needed !== 0) {
          return db('parties').where({ 'parties.party_id': party_id }).update({
            players_needed: results.players_needed,
          });
        } else {
          return;
        }
      });
  },
  // serializeParty(party) {
  //   return {
  //     party_id: party.party_id,
  //     party_name: xss(party.party_name),
  //     language: xss(party.language),
  //     time_of_event: xss(party.time_of_event),
  //     dnd_edition: xss(party.dnd_edition),
  //     players_needed: xss(party.players_needed),
  //     dm_needed: party.dm_needed,
  //     homebrew_rules: xss(party.homebrew_rules),
  //     classes_needed: xss(party.classes_needed),
  //     group_personality: xss(party.group_personality),
  //     online_or_not: party.online_or_not,
  //     camera_required: party.camera_required,
  //     about: xss(party.about),
  //     campaign_or_custom: xss(party.campaign_or_custom),
  //     date_created: party.date_created,
  //     party_complete: party.party_complete,
  //     user_id_creator: party.user_id_creator,
  //   };
  // },
};

module.exports = PartiesService;
