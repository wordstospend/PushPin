var assert =  require("assert");
var output;
var memDB = require('../memDb')(function(value){ output = value; });


describe('roll back to empty', function() {

    it('db roll back without reason', function (){
	memDB.rollback();
	assert.equal(output, 'NO TRANSACTION');
    });

    it('db roll back', function(){
	memDB._clear();
	memDB.begin();
	memDB.set('a', '10', true);
	memDB.rollback();
	memDB.get('a');
	assert.equal(output, 'NULL');

    });

});
describe('test basic set unset', function() {

    it('db basic behavior', function() {
    	memDB._clear();
	memDB.set('ex', '10');
	memDB.get('ex');
	assert.equal(output, '10');
	memDB.unset('ex');
	memDB.get('ex');
	assert.equal(output, 'NULL');
    });
});

describe('test of numEqualTo', function() {
    it('adding keys to the group of keys works', function(){
	memDB._clear();
	memDB.set('a', '10');
	memDB.set('b', '10');
	memDB.numEqualTo('10');
	assert.equal(output, '2');
    });
    it('things not in the set return "0"', function(){
	memDB.numEqualTo('20');
	assert.equal(output, '0');
    });
    it('reseting a key removes it from the previous set', function(){
	memDB.set('b', '30');
	memDB.numEqualTo('10');
	assert.equal(output, '1');
    });
});


describe('roll forward and back', function() {

    it('db first get with transaction', function(){
	memDB._clear();
	memDB.begin();
	memDB.set('a', '10', true);
	memDB.get('a');
	assert.equal(output, '10');
    });

    it('db seccond get with transaction', function(){
	memDB.begin();
	memDB.set('a', '20', true);
	memDB.get('a');
	assert.equal(output, '20');
    });

    it('after first rollback', function() {
	memDB.rollback();
	memDB.get('a');
	assert.equal(output, '10');
    });

    it('after seccond rollback', function(){
	memDB.rollback();
	memDB.get('a');
	assert.equal(output, 'NULL');
    });

});

describe('roll forward and back with commit', function(){
    it('roll forward with commit', function(){
	memDB._clear();
	memDB.begin();
	memDB.set('a', '10', true);
	memDB.begin();
	memDB.set('a', '20', true);
	memDB.commit();
	memDB.rollback();
	assert.equal(output, 'NO TRANSACTION');
	memDB.get('a');
	assert.equal(output, '20');
    });
});

describe('unset with rollback', function(){
    it('roll forward and unset', function(){
	memDB._clear();
	memDB.set('a', '10', true);
	memDB.begin();
	memDB.unset('a', true);
	memDB.get('a');
	assert.equal(output, 'NULL');
    });
    it('rollback and get', function(){
	memDB.rollback();
	memDB.get('a');
	assert.equal(output, '10');
    });
});

describe('numEqualTo and rollback', function(){
    it('roll forward and get numEqualTo', function(){
	memDB._clear();
	memDB.begin();
	memDB.set('a', '10', true);
	memDB.set('b', '10', true);
	memDB.numEqualTo('10');
	assert.equal(output, '2');
    });

    it('new session unset and numEqualTo', function(){
	memDB.begin();
	memDB.unset('b', true);
	memDB.numEqualTo('10');
	assert.equal(output, '1');
    });
    it('rollback and numEqualTo', function(){
	memDB.rollback();
	memDB.numEqualTo('10');
	assert.equal(output, '2');
	memDB.rollback();
	memDB.numEqualTo('10');
	assert.equal(output, '0');
    });

});
