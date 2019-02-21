let express = require('express');
let router  = express.Router();
let {isLogged} = require('../helpers/middlewares')
let {isSeller} = require('../helpers/middlewares')

let Product = require ("../models/Product")

//BUYER
router.get("/buyer", isLogged, (req,res,next) => {
  res.render("buyer/buyer")
})

router.get("/buyer/orders",(req,res,next) => {
  res.send("My Orders")
})

router.get("/buyer/buyerproducts",(req,res,next) => {
  Product.find()
  .then( products => {
    res.render("products/buyerProducts",{products})
  })
  .catch(e => next(e))
})

router.get("/buyer/buyerproducts/detail/:id", (req,res,next) =>{
  let {id}=req.params
  Product.findById(id)
  .then(product=>{
    res.render("products/buyerDetail",product)
  })
  .catch(e => next(e))
})

module.exports = router;