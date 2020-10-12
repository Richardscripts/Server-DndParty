const ProfileService = {
  getUserInfoFromDB(db, user_id) {
    return db('users')
      .select('*')
      .where({ user_id })
      .first()
      .then((res) => {
        delete res.password;
        delete res.user_email;
        return res;
      });
  },
  updateUserInfo(db, userInfo, user_id) {
    return db('users')
      .where({ user_id })
      .update(userInfo)
      .returning('*')
      .then((res) => {
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
