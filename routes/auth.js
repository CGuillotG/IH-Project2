let router = require ("express").Router()
let passport = require("passport")
// let uploadCloud = require('../helpers/cloudinary')
// const avatarGenerator = require("named-avatar-generator");

let User = require("../models/User")

function isLogged(req,res,next){
  if(req.isAuthenticated()) return next()
  return res.redirect("/login")
}
//we should move this
router.get("/profile",isLogged,(req,res,next) => {
  res.render("auth/profile")
})

router.get("/login", (req, res, next) => {
  res.render("auth/login", { error: req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req,res,next) => {
  if (req.body.username === "" || req.body.password === "") {
      res.render("auth/signup", { error: "Indicate username and password" });
      return;
  }
  if(req.body.password != req.body.password2){
      return res.render("auth/signup", {error: "Password doesn't match"})
  }
  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
        return res.render("auth/signup", { error: "The username already exists" });
    }
  })
 
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

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
