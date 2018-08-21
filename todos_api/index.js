require('dotenv').config();
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser');

///// TEMPORARY ///////////
var db = require('./models');
/////////////////////////////
    
var todoRoutes = require('./routes/todoLists');
const authRoutes = require('./routes/auth');
const errorHandler = require("./handlers/error");
const { loginRequired, ensureCorrectUser } = require('./middleware/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({encoded: true}));
app.use(express.static(__dirname +'/public'));
app.use(express.static(__dirname +'/views'));
    
// app.get('/', function(req, res){
//   res.sendFile('index.html');
// });

app.use('/api/auth', authRoutes);
app.use('/api/users/:userId/todoLists', loginRequired, ensureCorrectUser, todoRoutes);

app.use(function(req, res, next){
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(errorHandler);
    
app.listen(port, function(){
  console.log('APP IS RUNNING ON PORT ' +port);
});



  //TEMPORARY LOGIC////////////////////////////////////////////////////
updateDB = async function() {
  await db.User.update({}, {$unset: {defaultTodoList: 1}}, {multi: true, strict: false});
  var allUsers = await db.User.find({});
  for(let i = 0; i < allUsers.length; i++){
    allUsers[i] = allUsers[i].toObject();
    for(let j = 0; j < allUsers[i].priorityList.length; j++){
      allUsers[i].priorityList[j].listId = allUsers[i].todoLists[0];
    }
    let updatedUser = await db.User.findOneAndUpdate({_id: allUsers[i]._id}, {priorityList: allUsers[i].priorityList}, {new: true});
  }
  var allTodoLists = await db.TodoList.find({});
  for(let i = 0; i < allTodoLists.length; i++){
    let user = await db.User.findOne({_id: allTodoLists[i].user});
    user = user.toObject();
    allTodoLists[i] = allTodoLists[i].toObject();
    if(allTodoLists[i].priorityList){
      let length = allTodoLists[i].priorityList.length;
      for(let j = 0; j < length; j++){
        allTodoLists[i].priorityList[0].listId = allTodoLists[i]._id;
        user.priorityList.push(allTodoLists[i].priorityList.shift());
      }
      let updatedUser = await db.User.findOneAndUpdate({_id: user._id}, {priorityList: user.priorityList});
    }
    for(let j = 0; j < allTodoLists[i].nonPriorityList.length; j++){
      allTodoLists[i].nonPriorityList[j].listId = allTodoLists[i]._id;
    }
    for(let j = 0; j < allTodoLists[i].completedList.length; j++){
      allTodoLists[i].completedList[j].listId = allTodoLists[i]._id;
    }
    let updatedTodoList = await db.TodoList.findOneAndUpdate({_id: allTodoLists[i]._id}, {
      nonPriorityList: allTodoLists[i].nonPriorityList,
      completedList: allTodoLists[i].completedList
    }, {new: true});
  }
  await db.TodoList.update({}, {$unset: {priorityList: 1}}, {multi: true, strict: false});

  allUsers = await db.User.find({});
  for(let i = 0; i < allUsers.length; i++){
    allUsers[i] = allUsers[i].toObject();
    console.log('User: ');
    console.log(allUsers[i]);
  }

  let allLists = await db.TodoList.find({});
  for(let i = 0; i < allLists.length; i++){
    allLists[i] = allLists[i].toObject();
    console.log('List: ');
    console.log(allLists[i]);
  }

  //////////////////////////////////////////////////////////////////////
}
updateDB();