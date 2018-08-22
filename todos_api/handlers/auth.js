const db = require('../models');
const jwt = require('jsonwebtoken');
var passwordValidator = require('password-validator');

// Mailgun setup
var api_key = process.env.MAILGUN_API_KEY;
var domain = 'sandboxcf2abc5f7d344a4fbc55afd6a753be0a.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 
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
    let { id, username } = user;
    let isMatch = await user.comparePassword(req.body.password);
    if(isMatch) {
      let token = jwt.sign({
        id,
        username
      }, process.env.SECRET_KEY);
      return res.status(200).json({
        id,
        username,
        token
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
    let { id, username } = user;
    // Create a token (signing a token)
    let token = jwt.sign({
      id,
      username
    }, process.env.SECRET_KEY);
    return res.status(200).json({
      id,
      username,
      token
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

exports.requestReset = async function(req, res, next) {
  try {
    // Check that emails match
    if(req.body.email !== req.body.confirmedEmail) {
      throw new Error("Emails don't match");
    }
    // Verify email exists in db
    let user = await db.User.findOne({email: req.body.email});
    if(user === null) {
      throw new Error("Email doesn't exist");
    }
    // Create a token (signing a token) and store in db
    let token = jwt.sign({
      email: req.body.email
    }, process.env.SECRET_KEY);
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    // Send reset email with link
    var data = {
      from: 'TodoList Admin <todolist@jarol.net>',
      to: user.email,
      subject: 'TodoList Password Reset Request',
      text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + process.env.CLIENTHOST + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };
    await mailgun.messages().send(data);


    return res.status(200).json({
      email: req.body.email
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

exports.resetPassword = async function(req, res, next) {
  try {
    // Check that passwords match
    if(req.body.password !== req.body.confirmedPassword) {
      throw new Error("Passwords don't match");
    }
    // Validate password
    if(!schema.validate(req.body.password) || req.body.passwordScore <= 1){
      throw new Error("Passord cannot contain spaces and must have a strength of ok, good, or strong.");
    }
    // Decode token to get email address
    let decoded = await jwt.verify(req.body.token, process.env.SECRET_KEY);
      if(decoded) {
        // Find user
        let user = await db.User.findOne({email: decoded.email});
        // Make sure token has not expired
        if(user.resetPasswordToken !== req.body.token || Date.now() > user.resetPasswordExpires) {
          throw new Error("Password reset link is no long valid. Please request a reset again.")
        }
        // Update user's password
        user.password = req.body.password;
        // Reset password token and expiry
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        // Send success email
        var data = {
          from: 'TodoList Admin <todolist@jarodl.net>',
          to: user.email,
          subject: 'Your TodoList Password Has Been Reset',
          text: 'Hello, \n\n' +
              'This is a confirmation that the password for your account ' + user.email + 'has just been reset.'
        };
        mailgun.messages().send(data);
        // Reset token and token expiry in user
        // Log user in
        let { id, username } = user;
        // Create a token (signing a token)
        let token = jwt.sign({
          id,
          username
        }, process.env.SECRET_KEY);
        return res.status(200).json({
          id,
          username,
          token
        });
      } else {
        throw new Error('Token could not be decoded');
      }
    // });

    
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