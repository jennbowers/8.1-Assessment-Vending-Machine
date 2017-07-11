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

app.get('/api/sanity', function(req, res) {
  res.json({hello: 'Jenn'});
});

app.listen(3000, function() {
  console.log('Successfully created express application');
});

module.exports = app;

// GET /api/customer/items - get a list of items
// POST /api/customer/items/:itemId/purchases - purchase an item
// GET /api/vendor/purchases - get a list of all purchases with their item and date/time
// GET /api/vendor/money - get a total amount of money accepted by the machine
// POST /api/vendor/items - add a new item not previously existing in the machine
// PUT /api/vendor/items/:itemId - update item quantity, description, and cost
