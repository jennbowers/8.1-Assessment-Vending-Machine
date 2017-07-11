const expect = require('chai').expect;
const request = require('supertest');
const app = require('./app');
const Customer = require('./models/customers');
const Vendor = require('./models/vendors');

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

  // /api/customer/items
  // it('cats api endpoint returns all cats as json', function(done) {
  //   request(app)
  //   .get('/api/cats')
  //   .expect(200)
  //   .expect(function(res) {
  //     // you can put a different name in there to test to make sure it is right
  //     expect(res.body[0].name).to.equal('Skittles');
  //     expect(res.body[1].name).to.equal('Garfield');
  //     expect(res.body[2].name).to.equal('Princess Cat Face');
  //     expect(res.body.length).to.equal(3);
  //   }).end(done);
  // });




});

describe('basic vendor tests', function() {
  afterEach(function(done) {
    Vendor.deleteMany({}).then(done());
  });

  it('vendor test should clean up after itself', function(done) {
  // creates a new cat because we know we can
    const vendor = new Vendor().save().then(function(newVendor) {
      // count all the cats in the Cats database
      Vendor.count().then(function(count) {
        expect(count).to.equal(1);
        done();
      });
    });
  });

  it('can create a vendor item in the db and find it with mongoose', function(done) {
    const vendor = new Vendor({item: 'Coke', quantity: 2, cost: 50}).save().then(function(newVendor) {
      expect(newVendor.item).to.equal('Coke');
      expect(newVendor.quantity).to.equal(2);
      expect(newVendor.cost).to.equal(50);
      done();
    });
  });
});

describe('basic customer tests', function() {
  afterEach(function(done) {
    Customer.deleteMany({}).then(done());
    });

  it('customer test should clean up after itself', function(done) {
  // creates a new cat because we know we can
    const customer = new Customer().save().then(function(newCustomer) {
      // count all the cats in the Cats database
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


// A customer should be able to get a list of the current items, their costs, and quantities of those items
// A customer should be able to buy an item using money
// A customer should be able to buy an item, paying more than the item is worth (imagine putting a dollar in a machine for a 65-cent item) and get correct change. This change is just an amount, not the actual coins.
// A customer should not be able to buy items that are not in the machine, but instead get an error
// A vendor should be able to see total amount of money in machine
// A vendor should be able to see a list of all purchases with their time of purchase
// A vendor should be able to update the description, quantity, and costs of items in the machine
// A vendor should be able to add a new item to the machine
