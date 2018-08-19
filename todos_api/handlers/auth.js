const db = require('../models');
const jwt = require('jsonwebtoken');
var passwordValidator = require('password-validator');
 
// Create a schema
var schema = new passwordValidator();
 
// Add properties to it
schema
// .is().min(7)                                    // Minimum length 8
// .has().uppercase()                              // Must have uppercase letters
// .has().lowercase()                              // Must have lowercase letters
// .has().digits()                                 // Must have digits
// .has().symbols()                                 // Must have symbols
.has().not().spaces()                           // Should not have spaces
/*.is().not().oneOf(['Passw0rd', 'Password123', 'Password', 'password', '1234567'])*/; // Blacklist these values

exports.signin = async function(req, res, next) {
  var emailOrUsername = req.body.emailOrUsername;
  var user;
  try {
    if(emailOrUsername.indexOf('@') !== -1 && emailOrUsername.includes('.', emailOrUsername.indexOf('@'))) {
      user = await db.User.findOne({
        email: emailOrUsername
      });
    } else {
      user = await db.User.findOne({
        username: emailOrUsername
      });
    }
    let { id, username, defaultTodoList } = user;
    let isMatch = await user.comparePassword(req.body.password);
    if(isMatch) {
      let token = jwt.sign({
        id,
        username
      }, process.env.SECRET_KEY);
      return res.status(200).json({
        id,
        username,
        token,
        defaultTodoList
      });
    } else {
      return next({
        status: 400,
        message: "Invalid Email/Username/Password"
      });
    }
  } catch(err) {
    return next({
      status: 400,
      message: "Invalid Email/Username/Password"
    });
  }
};

exports.signup = async function(req, res, next) {
  try {
    // Check that passwords match
    if(req.body.password !== req.body.confirmedPassword) {
      throw new Error("Passwords don't match");
    }
    // Check that emails match
    if(req.body.email !== req.body.confirmedEmail) {
      throw new Error("Emails don't match.");
    }
    // Validate password
    if(!schema.validate(req.body.password) || req.body.passwordScore <= 1){
      throw new Error("Passord cannot contain spaces and must have a strength of ok, good, or strong.");
    }
    // Check that username doesn't have '@' or space
    if(req.body.username.includes('@') || req.body.username.includes(' ')){
      throw new Error("Username cannot contain '@' or a space.");
    }
    // Create a user
    let user = await db.User.create(req.body);
    let { id, username, defaultTodoList } = user;
    // Create a token (signing a token)
    let token = jwt.sign({
      id,
      username
    }, process.env.SECRET_KEY);
    return res.status(200).json({
      id,
      username,
      token,
      defaultTodoList
    });
  } catch(err) {
    console.log('Error signing up user: ');
    console.log(err.message);
    if(err.code === 11000) {
      err.message = 'Sorry, that username and/or email is taken';
    }
    return next({
      status: 400,
      message: err.message
    });
  }
};

exports.updateUser = async function(req, res, next) {
  try {
    // Find user
    let updatedUser = await db.User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true});
    return res.status(200).json(updatedUser);
  } catch(err) {
    if(err.code === 11000) {
      err.message = 'Sorry, that username and/or email is taken';
    }
    return next({
      status: 400,
      message: err.message
    });
  }
};