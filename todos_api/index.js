require('dotenv').config();
var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser');
    
var todoRoutes = require('./routes/todoLists');
const authRoutes = require('./routes/auth');
const errorHandler = require("./handlers/error");
const { loginRequired, ensureCorrectUser } = require('./middleware/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({encoded: true}));
app.use(express.static(__dirname +'/public'));
app.use(express.static(__dirname +'/views'));
    
app.get('/', function(req, res){
  res.sendFile('index.html');
});

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