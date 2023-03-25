const User = require('../models/User.model');
const createError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

module.exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return next(createError(StatusCodes.NOT_FOUND, 'Email or password incorrect'))
      }

      return user.checkPassword(req.body.password)
        .then((match) => {
          if (!match) {
            return next(createError(StatusCodes.NOT_FOUND, 'Email or password incorrect'))
          }

          const token = jwt.sign({ id: user.id }, 'test', {
            expiresIn: '10m'
          })

          res.json({accessToken: token})
        })
    })
    .catch(next)
}