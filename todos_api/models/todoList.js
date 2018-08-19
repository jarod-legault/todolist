var mongoose = require('mongoose');
const User = require('./user');

var todoListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Name cannot be blank!'
  },
  priorityList: {
    type: Array,
    default: []
  },
  nonPriorityList: {
    type: Array,
    default: []
  },
  completedList: {
    type: Array,
    default: []
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

todoListSchema.pre('remove', async function(next){
  try {
    let user = await User.findById(this.user);
    user.todoLists.remove(this.id);
    await user.save();
    return next();
  } catch(err) {
    return next(err);
  }
});

var TodoList = mongoose.model('TodoList', todoListSchema);

module.exports = TodoList;