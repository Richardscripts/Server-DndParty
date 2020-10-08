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
};

module.exports = ProfileService;
