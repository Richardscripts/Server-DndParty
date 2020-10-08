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
        delete res[0].user_id_creator;
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
      .select('user_name')
      .join('partyrequests', function () {
        this.on('users.user_id', '=', 'partyrequests.user_id');
      })
      .where({ 'partyrequests.party_id': party_id });
  },
};

module.exports = PartiesService;
