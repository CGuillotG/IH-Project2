let express = require('express');
let router  = express.Router();
let {isLogged} = require('../helpers/middlewares')
let {isSeller} = require('../helpers/middlewares')
let mongoose = require("mongoose")

let Product = require ("../models/Product")

//BUYER
router.get("/buyer", isLogged, (req,res,next) => {
  res.render("buyer/buyer")
})

router.get("/buyer/orders", isLogged, (req,res,next) => {  
  Product.aggregate([
    {
      '$lookup': {
        'from': 'orders', 
        'localField': 'order', 
        'foreignField': '_id', 
        'as': 'ordenes'
      }
    }, {
      '$match': {
        'ordenes.buyers.buyer': mongoose.Types.ObjectId(req.user._id)
      }
    }
  ])
  .then(prod=>{
    // let orders = []
    // let order = {}
    // console.log(result)
    // for (ord in prod.ordenes) {
    //   console.log(prod.ordenes[ord].minQuantity)
    // }
    
    // res.json(prod)
    res.render("orders/orders", {prod})
  })
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