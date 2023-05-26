//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
mongoose.connect("mongodb://127.0.0.1:27017/secretDB", {
  useNewUrlParser: true,
});
console.log(mongoose.connection.readyState);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
  username: String,
  password: String
})
const secret = "SOME_LONG_UNGUESSABLE_STRING";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });
const User = mongoose.model('User', userSchema);





app.get("/", (req, res) => {
      res.render("home");
  });
 
  app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});  

app.post("/register", (req, res) => {
 
  const newUser = new User({
    username: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err){
      console.log(err);
    }
    else{
      res.render("secrets");
    }
  })
}); 

app.post("/login", (req, res) => {
  const userName = req.body.username;
  const passWord = req.body.password;
  User.findOne({username: userName}, function(err, user){
  if (!err){
    if(user){
    if (user.password == passWord){
      res.render('secrets')
  } else {
    res.redirect("/login");
  }
}else {
  res.redirect("/login");
}
  } 
  })
});




app.listen(3000, function() {
    console.log("Server started on port 3000");
  });