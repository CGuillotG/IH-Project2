let express = require('express');
let router  = express.Router();

let Product = require ("../models/Product")

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