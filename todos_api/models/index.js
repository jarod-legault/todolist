var mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/todo-api', {
  keepAlive: true
});

mongoose.Promise = Promise;

module.exports.TodoList = require('./todoList');
module.exports.User = require('./user');