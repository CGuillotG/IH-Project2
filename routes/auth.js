let router = require ("express").Router()
let passport = require("passport")
let uploadCloud = require('../helpers/cloudinary')
let User = require("../models/User")
let {isLogged} = require('../helpers/middlewares')

//Profile
router.get("/profile",isLogged,(req,res,next) => {
  res.render("auth/profile", req.user)
})

router.get("/profile/edit",isLogged,(req,res,next) => {
  res.render("auth/profileedit", req.user)
})

router.post("/profile/edit",isLogged, uploadCloud.single('picURL'), (req,res,next) => {
  if(req.file) {
    req.body.picURL = req.file.secure_url
  }
   console.log("CardNum - " + req.body.cardNum)
  if(req.body.cardNum) {
    req.body.payment = {
      month:req.body.month,
      year:req.body.year,
      cvv:req.body.cvv,
      numberCard:req.body.cardNum,
      numberCardMasked: req.body.cardNum.substring(12)
    }
  }
  console.log(req.body)
  User.findByIdAndUpdate(req.user._id, req.body)
  .then(()=>res.redirect('/profile'))
})

//Dasboard redirect
router.get("/dash", isLogged, (req, res, next) => {
  if (req.user.isSeller) res.redirect("/seller")
  else res.redirect("/buyer")
})

//Log In
router.get("/login", (req, res, next) => {
  let error = req.flash("error")[0]
  res.render("auth/login", { error });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/dash",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

//Sign Up
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", uploadCloud.single('picURL'), (req,res,next) => {
  if (req.body.username === "" || req.body.password === ""|| req.body.email === "") {
      res.render("auth/signup", { error: "Indicate username, email and password" });
      return;
  }
  if(req.body.password != req.body.password2){
      return res.render("auth/signup", {error: "Password doesn't match"})
  }
  if(req.file) {
    req.body.picURL = req.file.secure_url
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