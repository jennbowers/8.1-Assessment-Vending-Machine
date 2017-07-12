const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
const Customer = require('../models/customers');
const Vendor = require('../models/vendors');

describe('test to get the total money amount from the machine', function() {

  beforeEach(function(done) {
    Vendor.insertMany([
      {item: 'Coke', quantity: 5, totalCost: 10},
      {item: 'Pepsi', quantity: 15, totalCost: 100},
      {item: 'Dr. Pepper', quantity: 1, totalCost: 1},
      {item: 'Mtn Dew', quantity: 2, totalCost: 2}
    ]).then(done());
  });

  afterEach(function(done) {
    Vendor.deleteMany({}).then(done());
    });

  it('can take the total amount of money from the vendor schema and display it on the screen', function(done) {
    request(app)
    .get('/api/vendor/money')
    .expect(200)
    .expect(function(res) {
      expect(res.body).to.equal(113);
    }).end(done);
  });
});

describe('test to let vendor add more items to the machine', function() {

  afterEach(function(done) {
    Customer.deleteMany({}).then(done());
    });

  it('vendor api endpoint will allow addition of item to customer schema', function(done) {
    request(app)
    .post('/api/vendor/items')
    .send({item: 'Cherry Coke', quantity: 4, totalCost: 75})
    .expect(201)
    .expect(function(res) {
      Customer.count().then(function(count) {
        expect(count).to.equal(1);
      });
    }).end(done);
  });
});

describe('basic vendor api endpoint tests', function() {

  beforeEach(function(done) {
    Vendor.insertMany([
      {item: 'Coke', quantity: 5, totalCost: 10},
      {item: 'Pepsi', quantity: 15, totalCost: 100},
      {item: 'Dr. Pepper', quantity: 1, totalCost: 1},
      {item: 'Mtn Dew', quantity: 2, totalCost: 2}
    ]).then(done());
  });

  afterEach(function(done) {
    Vendor.deleteMany({}).then(done());
    });

  it('vendor api endpoint returns all items as json', function(done) {
    request(app)
    .get('/api/vendor/purchases')
    .expect(200)
    .expect(function(res) {
      expect(res.body[0].item).to.equal('Coke');
      expect(res.body[1].item).to.equal('Pepsi');
      expect(res.body[2].item).to.equal('Dr. Pepper');
      expect(res.body[3].item).to.equal('Mtn Dew');
    }).end(done);
  });
});

describe('basic vendor tests', function() {
  afterEach(function(done) {
    Vendor.deleteMany({}).then(done());
  });

  it('vendor test should clean up after itself', function(done) {
    const vendor = new Vendor().save().then(function(newVendor) {
      Vendor.count().then(function(count) {
        expect(count).to.equal(1);
        done();
      });
    });
  });

  it('can create a vendor item in the db and find it with mongoose', function(done) {
    const vendor = new Vendor({item: 'Coke', quantity: 2, totalCost: 50}).save().then(function(newVendor) {
      expect(newVendor.item).to.equal('Coke');
      expect(newVendor.quantity).to.equal(2);
      expect(newVendor.totalCost).to.equal(50);
      done();
    });
  });
});

describe('basic api endpoint tests', function() {
  it('can access api endpoints successfully', function(done) {
    request(app)
    .get('/api/sanity')
    .expect(200, {hello: 'Jenn'}, done);
  });
});

describe('sanity test', function() {
  it('should run this test', function () {
    expect(1).to.not.equal(2);
  });
});





// A vendor should be able to update the description, quantity, and costs of items in the machine
// ---------------TESTS DONE
// A vendor should be able to see a list of all purchases with their time of purchase
// A vendor should be able to add a new item to the machine
// A vendor should be able to see total amount of money in machine
