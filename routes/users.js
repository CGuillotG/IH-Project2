let express = require('express');
let router  = express.Router();
let Product = require ("../models/Product")
let User = require ("../models/User")
let Order = require("../models/Order")


/* GET home page */
router.get('/', (req,res,next) => {
  res.render('index');
});

//BUYER
router.get("/buyer",(req,res,next) => {
  res.render("products/buyer")
})

//SELLER
router.get("/seller",(req,res,next) => {
  res.render("products/seller", req.user)
})


//ADD PRODUCT SELLER
router.get("/seller/add",(req,res,next) => {
  res.render("products/sellerAdd")
})

router.post("/seller/add",(req,res,next) => {
  Product.create(req.body)
  Order.create(req.body) 
  .then(() => res.redirect("/seller/products"))
  .catch(e=>next(e))
})

//DETAIL PRODUCT SELLER
router.get("/seller/products/detail/:id", (req,res,next) => {
  let {id}=req.params
  Product.findById(id)
  .then(product => {
    res.render("products/detail", product)
  })
  .catch(e => next(e))
})


//DELETE PRODUCT SELLER
router.get("/seller/products/detail/:id/delete",(req,res,next) => {
  
  let {id} = req.params
  console.log(id)
  Product.findByIdAndRemove(id)
  .then(()=>{
    res.redirect("/seller/products")
  })
  .catch(e => next(e))
})





//VIEW ALL PRODUCT SELLER
router.get("/seller/products",(req,res,next)=>{
  Product.find()
  .then(products=>{
    res.render("products/sellerProducts",{products})
  })
  .catch(e=>next(e))
})


module.exports = router;