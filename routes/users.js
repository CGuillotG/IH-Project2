let express = require('express');
let router  = express.Router();
let Product = require ("../models/Product")
let User = require ("../models/User")
let Order = require("../models/Order")
let paypal = require("paypal-rest-sdk")
let uploadCloud = require('../helpers/cloudinary')
let {isLogged} = require('../helpers/middlewares')
let {isSeller} = require('../helpers/middlewares')

//SELLER
router.get("/seller", /*isLogged, isSeller,*/(req,res,next) => {
  res.render("seller/seller")
})


//ADD PRODUCT SELLER
router.get("/seller/add", /*isLogged, isSeller,*/ (req,res,next) => {
  res.render("seller/sellerAdd")
})

router.post("/seller/add", /*isLogged, isSeller,*/ uploadCloud.single('picURL'), (req,res,next) => {
  if(req.file) {
    req.body.picURL = req.file.secure_url
  }
  req.body.seller = req.user._id
  Order.create(req.body)
  .then(order=> {
    req.body.order = order._id
    Product.create(req.body)
    .then(() => res.redirect("/seller/products"))
  })
  .catch(e=>next(e))
  
})

//DETAIL PRODUCT SELLER
router.get("/seller/products/detail/:id", /*isLogged, isSeller,*/(req,res,next) => {
  let {id}=req.params
  Product.findById(id)
  .then(product => {
    res.render("products/detail", product)
  })
  .catch(e => next(e))
})

//DELETE PRODUCT SELLER
router.get("/seller/products/detail/:id/delete", /*isLogged, isSeller,*/ (req,res,next) => {
  
  let {id} = req.params
  console.log(id)
  Product.findByIdAndRemove(id)
  .then(()=>{
    res.redirect("/seller/products")
  })
  .catch(e => next(e))
})

//VIEW ALL PRODUCT SELLER
router.get("/seller/products", /*isLogged, isSeller,*/ (req,res,next)=>{
  Product.find()
  .then(products=>{
    res.render("seller/sellerProducts",{products})
  })
  .catch(e=>next(e))
})


module.exports = router;