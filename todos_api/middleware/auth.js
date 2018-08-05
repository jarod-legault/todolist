require('dotenv').load();
var db = require('../models');
const jwt = require('jsonwebtoken');

// make sure the user is logged in - Authentication
exports.loginRequired = function(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if(decoded) {
        return next();
      } else {
        return next({
          status: 401,
          message: 'Please log in first'
        });
      }
    });
  } catch (err) {
    console.log('User is not logged in properly (/middleware/auth.js)')
    return next({
      status: 401,
      message: 'Please log in first'
    });
  }
};


// make sure we get the correct user - Authorization
exports.ensureCorrectUser = function(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if(decoded && decoded.id === req.params.userId) {
        return next();
      } else {
        console.log('Token does not match user!');
        return next({
          status: 401,
          message: 'Unauthorized'
        });
      }
    });
  } catch (err){
    return next({
      status: 401,
      message: 'Unauthorized'
    });
  }
};

// make sure users can only access their lists
exports.ensureUserOwnsList = async function(req, res, next) {
  try {
    let listOwner = await db.TodoList.find({_id: req.params.listId}, 'user');
    if(req.params.userId.toString() === listOwner[0].user.toString()){
      return next();
    } else {
      console.log('User does not match list owner!');
      return next({
        status: 401,
        message: 'Unauthorized'
      });
    }
  } catch (err){
    return next({
      status: 401,
      message: 'Unauthorized'
    });
  }
};