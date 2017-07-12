const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
const Customer = require('../models/customers');
const Vendor = require('../models/vendors');


describe('basic customer api endpoint tests', function() {

  beforeEach(function(done) {
    Customer.insertMany([
      {item: 'Coke', quantity: 5, cost: 10},
      {item: 'Pepsi', quantity: 15, cost: 100},
      {item: 'Dr. Pepper', quantity: 1, cost: 1},
      {item: 'Mtn Dew', quantity: 2, cost: 2}
    ]).then(done());
  });

  afterEach(function(done) {
    Customer.deleteMany({}).then(done());
    });

  it('customer api endpoint returns all items as json', function(done) {
    request(app)
    .get('/api/customer/items')
    .expect(200)
    .expect(function(res) {
      expect(res.body[0].item).to.equal('Coke');
      expect(res.body[1].item).to.equal('Pepsi');
      expect(res.body[2].item).to.equal('Dr. Pepper');
      expect(res.body[3].item).to.equal('Mtn Dew');
    }).end(done);
  });
});


describe('basic customer tests', function() {
  afterEach(function(done) {
    Customer.deleteMany({}).then(done());
    });

  it('customer test should clean up after itself', function(done) {
    const customer = new Customer().save().then(function(newCustomer) {
      Customer.count().then(function(count) {
        expect(count).to.equal(1);
        done();
      });
    });
  });


  it('can create a customer item in the db and find it with mongoose', function(done) {
    const customer = new Customer({item: 'Coke', quantity: 10, cost: 50}).save().then(function(newCustomer) {
      expect(newCustomer.item).to.equal('Coke');
      expect(newCustomer.quantity).to.equal(10);
      expect(newCustomer.cost).to.equal(50);
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



// A customer should be able to buy an item using money
// A customer should be able to buy an item, paying more than the item is worth (imagine putting a dollar in a machine for a 65-cent item) and get correct change. This change is just an amount, not the actual coins.
// A customer should not be able to buy items that are not in the machine, but instead get an error
// ---------------TESTS DONE
// A customer should be able to get a list of the current items, their costs, and quantities of those items
