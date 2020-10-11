const ProfileService = {
  getUserInfoFromDB(db, id) {
    return db('users')
      .select('*')
      .where({ user_id: id })
      .first()
      .then((res) => {
        delete res.password;
        delete res.user_email;
        return res;
      });
  },
  getUserCreatedTablesFromDB(db, id) {
    return db('parties')
      .select('*')
      .where({ 'parties.user_id_creator': id })
      .then((res) => {
        return res;
      });
  },
};

module.exports = ProfileService;
