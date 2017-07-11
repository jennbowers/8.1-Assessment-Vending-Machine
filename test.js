const expect = require('chai').expect;
const request = require('supertest');
const app = require('./app');
const Customer = require('./models/customers');
const Vendor = require('./models/vendors');


describe('basic vendor tests', function() {
  afterEach(function(done) {
    Vendor.deleteMany({}).then(done());
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
