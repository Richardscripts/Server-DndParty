const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const AuthService = {
  registerUser(db, newUser) {
    return db('users')
      .insert(newUser)
      .returning('*')
      .then((res) => {
        return res[0];
      });
  },
  getUserWithUserName(db, user_name) {
    return db('thingful_users').where({ user_name }).first();
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256',
    });
  },
  verifyJwt(token) {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
  },
};

module.exports = AuthService;
