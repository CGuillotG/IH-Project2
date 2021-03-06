let express = require('express');
let router  = express.Router();
let Product = require ("../models/Product")
let User = require ("../models/User")
let Order = require("../models/Order")
let Paypal = require("paypal-rest-sdk") 
let {isLogged} = require('../helpers/middlewares')
let {isSeller} = require('../helpers/middlewares')

//PAYPAL
router.get("/buyer/paypal", isLogged, (req, res) => {
  res.send('Autorizando')
})

router.post("/buyer/paypal", isLogged, (req,res,next) => {
  Product.findById(req.body.id) //Probably an unnecesary call
    .then(product => {
      let total = (req.body.unitPrice*req.body.buyerQuantity)
      let create_payment_json = {
        "intent": "sale",
        "payer": {
          "payment_method": "paypal"
        },
      "redirect_urls": {
          //  "return_url": `http://localhost:3000/buyer/paypal/success/${req.user._id}/${req.body.id}/${req.body.buyerQuantity}`,
          //  "cancel_url": "http://localhost:3000.com/buyer/paypal/cancel"
          "return_url": `https://community-ihproject2.herokuapp.com/buyer/paypal/success/${req.user._id}/${req.body.id}/${req.body.buyerQuantity}`,
          "cancel_url": "https://community-ihproject2.herokuapp.com/buyer/paypal/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": req.body.title,
                  "sku": "item",
                  "price": req.body.unitPrice,
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


router.get("/buyer/paypal/success/:id/:prodid/:qty", /* isLogged,  */(req,res,next) => {
  let payerId = req.query.PayerID
  let paymentId = req.query.paymentId
  let userId = req.params.id
  let prodId = req.params.prodid
  let qty = req.params.qty
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
      Product.findById(prodId)
      .then(product=>{
        let orderId = product.order
        Order.findById(orderId)
        .then(order=>{
          let buyers = order.buyers
          buyers.push({buyer:userId,buyerQuantity:qty})
          Order.findByIdAndUpdate(orderId, {buyers}, {new:true})
          .then(norder=>{
            console.log("Written!")
            // res.json(norder)
            let rendervars = {
              title:product.title,
              unitPrice:product.unitPrice,
              quantity:qty,
              totalPrice:qty*product.unitPrice,
              productId:prodId
            }
            res.render('orders/newOrder', rendervars)
          })
        })
      })
    }
  })
})

router.get("/buyer/paypal/cancel",(req,res,next) => {
  res.send("cancelled")
})

  module.exports = router