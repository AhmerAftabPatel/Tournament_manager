const User = require('../models/user')
const { check, validationResult } = require('express-validator')
var jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')
// const { response } = require("express");

exports.signup = (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    })
  }

  const user = new User(req.body)
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: 'NOT able to save user in DB',
      })
    }
    res.json({
      role: user.role,
      username: user.first_name,
      email: user.email,
      id: user._id,
    })
  })
}

exports.signin = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Max-Age', '1800')
  res.setHeader('Access-Control-Allow-Headers', 'content-type')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'PUT, POST, GET, DELETE, PATCH, OPTIONS',
  )
  const errors = validationResult(req)
  const { email, password } = req.body
  console.log(email)

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    })
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'USER Number does not exists',
      })
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'phone number and password do not match',
      })
    }

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET)
    //put token in cookie
    res.cookie('token', token, { expire: new Date() + 9999 })

    //send response to front end
    const { _id, first_name, email, role } = user
    return res.status(200).json({
      token,
      user: { _id, first_name, email, role },
    })
  })
}

exports.signout = (req, res) => {
  res.clearCookie('token')
  res.json({
    message: 'User signedout',
  })
}
exports.getAllUsers = (req, res) => {
  User.find().exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: 'no users found',
      })
    }
    res.json(users)
  })
}

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: 'authentication',
})

// exports.isAuthenticated = (req, res, next) => {
//   let checker = req.profile && req.authentication;
//   if (!checker) {
//     return res.status(403).json({
//       error: "ACCESS DENIED"
//     });
//   }
//   next();
// };

exports.isAuthenticated = (req, res, next) => {
  let auth = req.headers['authorization']

  const token = auth.substring(7, auth.length)
  const requestAuth = jwt.verify(token, process.env.SECRET)
  User.findById(requestAuth._id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'user not found in database',
      })
    }
    req.user = user

    let checker = requestAuth._id && auth && requestAuth._id == user._id
    if (user.role !== 1) {
      if (!checker) {
        return res.status(403).json({
          error: 'ACCESS DENIED',
        })
      }
    }

    next()
  })
}
exports.isAdmin = (req, res, next) => {
  if (req.user.role === 0) {
    return res.status(403).json({
      error: 'access denied,You are not an admin',
    })
  }

  next()
}
