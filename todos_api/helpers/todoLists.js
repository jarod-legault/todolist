var db = require('../models');

exports.getTodoLists = async function(req, res, next){
  try {
    let todoLists = await db.TodoList.find({user: req.params.userId}, '_id name priorityList').sort('name');
    res.status(200).json(todoLists);
  } catch (err) {
    next(err);
  }
};

exports.createTodoList = async function(req, res, next){
  var newTodoList;
  try {
    if(req.body._id){
      newTodoList = await db.TodoList.create(req.body);
    } else {
      newTodoList = await db.TodoList.create({
        name: req.body.name,
        user: req.params.userId
      });
    }
    let foundUser = await db.User.findById(req.params.userId);
    foundUser.todoLists.push(newTodoList._id);
    await foundUser.save();
    return res.status(200).json(newTodoList);
  } catch (err) {
    return next(err);
  }
};

exports.getTodoList = async function(req, res, next){
  try{
    let foundTodoList = await db.TodoList.findById(req.params.listId);
    let user = await db.User.findById(req.params.userId);
    foundTodoList = foundTodoList.toObject();
    user = user.toObject();
    foundTodoList.priorityList = user.priorityList;
    res.status(200).json(foundTodoList);
  } catch(err) {
    return next(err);
  }
  
  // db.TodoList.findById(req.params.todoListId)
  // .then(function(foundTodoList){
  //   res.json(foundTodoList);
  // })
  // .catch(function(err){
  //   // res.send(err);
  //   next(err);
  // });
};

exports.updateTodoList = async function(req, res, next){
  try {
    if(req.body.priorityList) {
      await db.User.findOneAndUpdate({_id: req.params.userId}, {priorityList: req.body.priorityList}, {new: true});
      delete req.body.priorityList;
    }
    let updatedTodoList = await db.TodoList.findOneAndUpdate({_id: req.params.listId}, req.body, {new: true});
    updatedTodoList = updatedTodoList.toObject();
    let user = await db.User.findById(req.params.userId);
    updatedTodoList = {
      ...updatedTodoList,
      priorityList: user.priorityList
    }
    res.status(200).json(updatedTodoList);
  } catch(err) {
    return next(err);
  }
  
  // db.TodoList.findOneAndUpdate({_id: req.params.todoId}, req.body, {new: true})
  // .then(function(updatedTodoList){
  //   res.json(updatedTodoList);
  // })
  // .catch(function(err){
  //   // res.send(err);
  //   next(err);
  // });
};

exports.deleteTodoList = async function(req, res, next){
  try {
    let foundUser = await db.User.findById(req.params.userId);
    foundUser.priorityList = foundUser.priorityList.filter(task => task.listId.toString() !== req.params.listId);
    await foundUser.save();
    let deleteStatus = await db.TodoList.remove({_id: req.params.listId});
    if(deleteStatus.n < 1) throw new Error('List was not deleted');
    res.status(200).json({message: 'Deleted todo list'});
  } catch(err) {
    return next(err);
  }
  
  // db.TodoList.remove({_id: req.params.todoId})
  // .then(function(){
  //   res.status(200).json({message: 'Deleted todo list'});
  // })
  // .catch(function(err){
  //   // res.send(err);
  //   next(err);
  // });
};

module.exports = exports;