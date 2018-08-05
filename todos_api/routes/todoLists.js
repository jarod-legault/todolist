var express = require('express');
var router = express.Router({ mergeParams: true}); // mergeParams gives us access to params.userId
var db = require('../models');
var helpers = require('../helpers/todoLists');
const { ensureUserOwnsList } = require('../middleware/auth');

// Prefixed by '/api/users/:userId/todoLists'
router.route('/')
  .get(helpers.getTodoLists)
  .post(helpers.createTodoList);

router.route('/:listId')
  .get(ensureUserOwnsList, helpers.getTodoList)
  .put(ensureUserOwnsList, helpers.updateTodoList)
  .delete(ensureUserOwnsList, helpers.deleteTodoList);

module.exports = router;