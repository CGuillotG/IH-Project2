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
        'as': 'order'
      }
    }, {
      '$lookup': {
        'from': 'users', 
        'localField': 'seller', 
        'foreignField': '_id', 
        'as': 'seller'
      }
    }, {
      '$match': {
        'order.buyers.buyer': mongoose.Types.ObjectId(req.user._id)
      }
    }
  ])
  .then(prod=>{
    for (p in prod){
      let buyers = {}
      for (b in prod[p].order[0].buyers) {
          if(toString(prod[p].order[0].buyers[b].buyer) === toString(req.user._id)){
            buyers = {
              _id: prod[p].order[0].buyers[b]._id,
              totalPrice: prod[p].order[0].buyers[b].buyerQuantity*prod[p].unitPrice,
              buyerQuantity: prod[p].order[0].buyers[b].buyerQuantity,
            }
          }
      }
      prod[p].order[0].buyers = {...buyers}
    }
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
  // Product.findById(id)
  Product.aggregate(
    [
      {
        '$lookup': {
          'from': 'orders', 
          'localField': 'order', 
          'foreignField': '_id', 
          'as': 'order'
        }
      }, {
        '$lookup': {
          'from': 'users', 
          'localField': 'seller', 
          'foreignField': '_id', 
          'as': 'seller'
        }
      }, {
        '$match': {
          '_id': mongoose.Types.ObjectId(id)
        }
      }
    ]
  )
  .then(product=>{
    let unitsBought = 0
    let totalBuyers = 0
    let prod = {...product[0]}
    for (b in prod.order[0].buyers) {
      unitsBought += prod.order[0].buyers[b].buyerQuantity
      totalBuyers++
    }
    prod.unitsBought = unitsBought
    prod.totalBuyers = totalBuyers
    res.render("products/buyerDetail",prod)
  })
  .catch(e => next(e))
})

module.exports = router;