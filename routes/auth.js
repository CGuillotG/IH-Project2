let router = require ("express").Router()
let passport = require("passport")
let uploadCloud = require('../helpers/cloudinary')
let User = require("../models/User")

//Middleware Authentication
function isLogged(req,res,next){
  if(req.isAuthenticated()) return next()
  return res.redirect("/login")
}

//Profile
router.get("/profile",isLogged,(req,res,next) => {
  res.render("auth/profile")
})

router.get("/profile/edit",isLogged,(req,res,next) => {
  res.render("auth/editprofile")
})

router.post("/profile/edit",isLogged,(req,res,next) => {
  
})

//Log In
router.get("/login", (req, res, next) => {
  res.render("auth/login", { error: req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

//Sign Up
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", uploadCloud.single('picUrl'),(req,res,next) => {
  if (req.body.username === "" || req.body.password === ""|| req.body.email === "") {
      res.render("auth/signup", { error: "Indicate username, email and password" });
      return;
  }
  if(req.body.password != req.body.password2){
      return res.render("auth/signup", {error: "Password doesn't match"})
  }
  if(req.files) {
    req.body.picUrl = req.files.picUrl[0].url
    console.log(req.body.picUrl)
  }
  User.register({...req.body}, req.body.password)
  .then(()=>{
      passport.authenticate("local")(req,res, () => {
      res.redirect("/profile")
      })
  })
  .catch(e=>{
      res.render("auth/signup", {error: e})
  })
})

//Log Out
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;