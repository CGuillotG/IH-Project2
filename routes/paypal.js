let express = require('express');
let router  = express.Router();
let Product = require ("../models/Product")
let User = require ("../models/User")
let Order = require("../models/Order")
let Paypal = require("paypal-rest-sdk") 

//PAYPAL
router.get("/buyer/paypal", (req, res) => {
  res.send('Autorizando')
})

router.post("/buyer/paypal",(req,res,next) => {
  Product.findById(req.body.id)
    .then(product => {
      let total = (product.unitPrice*req.body.buyerQuantity)
      let create_payment_json = {
        "intent": "sale",
        "payer": {
          "payment_method": "paypal"
        },
      "redirect_urls": {
          "return_url": "http://localhost:3000/buyer/paypal/success",
          "cancel_url": "http://localhost:3000/buyer/paypal/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": product.title,
                  "sku": "item",
                  "price": product.unitPrice,
                  "currency": "MXN",
                  "quantity": req.body.buyerQuantity
              }]
          },
          "amount": {
              "currency": "MXN",
              "total": total
          },
          "description": "This is the payment description."
      }]
  };
  
  
    Paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
          throw error;
      } else {
          for(let i=0; i<payment.links.length; i++){
            if(payment.links[i].rel === "approval_url")
            res.redirect(payment.links[i].href)
          }
      }
    });
 


  
  })
    })
  
  
  router.get("/buyer/paypal/success", (req,res,next) => {
    let payerId = req.query.PayerID
    let paymentId = req.query.paymentId
  
    let execute_payment_json = {
      "payer_id":payerId,
      "transactions":[{
        "amount":{
          "currency":"MXN",
          "total":payerId.total
        }
      }]
    }
  
    Paypal.payment.execute(paymentId,execute_payment_json,function(error,payment){
      if(!error){
        throw error
      } else {
        res.redirect("/buyer/orders")
      }
  
    })
  
  })
  
  router.get("/buyer/paypal/cancel",(req,res,next) => {
    res.send("cancelled")
  })




  module.exports = router