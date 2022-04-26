//jshint esversion:6

require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const session = require("express-session")
const passport =  require("passport")
const passportLocalMongoose =  require("passport-local-mongoose")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook');
const findOrCreate = require('mongoose-findorcreate')

const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Get currentYear 
const currentYear = new Date().getFullYear(); 

app.use(session({
  secret: "Our little secret.",
  resave:false,
  uninitialized: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://excel:excel2000@cluster0.nmntn.mongodb.net/blogDB");
// mongoose.connect("mongodb://localhost:27017/blogDB");


// --------- AUTHENTICATION ---------- //

const userSchema = new mongoose.Schema ({
  accontName: String,
  email:String,
  password: String,
  googleId: String,
  facebookId: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// -----  Targeting LogOut Route  ------ //

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

// -----  Targeting Register Route  ------ //

app.get("/register", function(req, res){
  res.render("register", {currentYear:currentYear})
})

app.post("/register", function(req, res){

  // accountName = req.body.accountName

  User.register({username: req.body.username}, req.body.password, function(err, user){    
    if (err) {
      console.log(err)
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/");  
      });
    }
  });
});

// -----  Targeting Login Route  ------ //

app.get("/login", function(req, res){
  res.render("login", {currentYear:currentYear})
})

app.post ("/login", passport.authenticate('local', {
  successRedirect: "/compose",
  failureRedirect: "/login",
}))

// Creating Post Schema
postSchema = new mongoose.Schema ({
  name:String,
  post: String
})
// Creating Post Model
const Post = mongoose.model("post", postSchema)


// -------------   Main Page    --------------- //

app.get("/", function(req, res){
  Post.find(function(err, postName){
    if (!err){
      res.render("home", {mainText: homeStartingContent, posts: postName, currentYear:currentYear})
    }
  })
});
app.post("/", function(req, res){
  const newText = req.body.newText
  const bigText = req.body.bigText  
  const post = new Post ({
    name: newText,
    post: bigText
  })
  post.save()
  res.redirect("/");
});

app.get("/about", function(req, res){
  res.render("about", {mainText: aboutContent, currentYear:currentYear})
});

app.get("/contact", function(req, res){
  res.render("contact", {mainText: contactContent, currentYear:currentYear})
});

app.get("/compose", function(req, res){
  if (req.isAuthenticated()){
    res.render("compose", {currentYear:currentYear})
  } else {
    res.redirect("/login")
  }  
});

app.get("/posts/:topic", function(req, res){

let parameter = _.kebabCase(req.params.topic)

  Post.find(function(err, postName){
    if (!err){
      for (let post of postName){
        const postTitle = _.kebabCase(post.name)       
        if (parameter === postTitle){
          res.render("posts", {title :post.name, bigText :post.post, currentYear:currentYear} )
        }
      }
    } else {
      console.log(err)
    }
  })

});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server running on port 3000");
});
