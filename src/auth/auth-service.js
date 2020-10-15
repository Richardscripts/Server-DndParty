const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const { JWT_SECRET } = require('../../config');

const AuthService = {
  registerUser(db, newUser) {
    return db('users')
      .insert(newUser)
      .returning('*')
      .then((res) => {
        return res[0];
      });
  },
  getUserEmail(db, user_email) {
    return db('users').where({ user_email }).first();
  },
  getUsername(db, user_name) {
    return db('users').where({ user_name }).first();
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, JWT_SECRET, {
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
