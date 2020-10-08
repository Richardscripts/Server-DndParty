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
  getJoinedParty(db, party_id) {
    return db('partyusers')
      .select('user_name')
      .join('users', function () {
        this.on('users.user_id', '=', 'partyusers.user_id');
      })
      .where({ 'partyusers.party_id': party_id });
  },
  getUserJoinedParty(db, user_id) {
    return db('parties')
      .select('parties.party_name')
      .join('partyusers', function () {
        this.on('parties.party_id', '=', 'partyusers.party_id');
      })
      .where({ 'partyusers.user_id': user_id })
      .then((res) => {
        return res;
      });
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
};

module.exports = PartiesService;
