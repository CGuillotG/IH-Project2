let router = require ("express").Router()
let passport = require("passport")

let User = require("../models/User")


router.get("/login",(req,res,next)=>{
    res.render("/auth/login")
})




module.exports = router