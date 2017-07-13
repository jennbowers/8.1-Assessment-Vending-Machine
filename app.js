const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const parseurl = require('parseurl');
const Customer = require('./models/customers');
const Vendor = require('./models/vendors');
mongoose.Promise = require('bluebird');

const app = express();

const nodeEnv = process.env.NODE_ENV || "development";
const config = require('./config.json')[nodeEnv];


// mongoose.connect('mongodb://localhost:27017/jbvending');

app.use('/static', express.static('static'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
mongoose.connect(config.mongoURL);

// API ENDPOINTS
// render index page with all vending machine items available
app.get('/api/customer/items', function(req, res) {
  Customer.find({}).then(function(customers) {
    res.json(customers);
  });
});

app.post('/api/customer/items/Coke/purchases', function(req, res) {
  // updating the customer table to reflect the new quantities
  // var id = "Coke";
  var amountBought = 1;
  var amountPaid = 50;
  var msg = '';

  Customer.findOne({item: 'Coke'}).then(function(result) {
    console.log(result);
    var totalPrice = amountBought * result.cost;
    if (!result || result.quantity === 0){
      msg = 'There are no more left, pick another item';
      return msg;
    } else if (amountBought > result.quantity) {
      msg = 'There are not enough in the machine';
      return msg;
    } else {
      result.quantity -= amountBought;
      result.save().then(function(newItem) {
        const newVendor = new Vendor({item: newItem.item, quantity: amountBought, totalCost: totalPrice}).save().then(function() {
          if (amountPaid > totalPrice){
            var change = amountPaid - totalPrice;
            msg = 'Your change is equal to: ' + change;
            console.log(change);
            return msg;
          } else if (amountPaid < totalPrice) {
            var owed = totalPrice - amountPaid;
            console.log(owed);
            msg = 'You still owe: ' + owed;
            return msg;
          } else if (amountPaid === totalPrice) {
            msg = 'Thank you!';
            return msg;
          }
          res.status(201).json({});
        });
      });
    }
  });

});

app.get('/api/vendor/purchases', function(req, res) {
  Vendor.find({}).then(function(vendors) {
    res.json(vendors);
  });
});

app.post('/api/vendor/items', function(req, res) {
  const newCustomer = new Customer(req.body).save().then(function(item) {
    res.status(201).json({});
  });
});

app.patch('/api/vendor/items/:itemId', function(req, res) {
  var id = "Coke";
    Customer.update({item: id}, {$set: {quantity: 5}}).then(function(item) {
      res.status(200).json({});
    });
});

app.get('/api/vendor/money', function(req, res) {
  Vendor.find({}).then(function(items) {
    var total = 0;
    for(var i = 0; i < items.length; i++) {
      total += items[i].totalCost;
    }
    res.json(total);
  });
});

app.get('/api/sanity', function(req, res) {
  res.json({hello: 'Jenn'});
});

app.listen(3000, function() {
  console.log('Successfully created express application');
});

module.exports = app;


// POST /api/customer/items/:itemId/purchases - purchase an item


// -----DONE
// GET /api/customer/items - get a list of items
// GET /api/vendor/purchases - get a list of all purchases with their item and date/time
// --POST /api/vendor/items - add a new item not previously existing in the machine
// GET /api/vendor/money - get a total amount of money accepted by the machine
// PUT /api/vendor/items/:itemId - update item quantity, description, and cost
