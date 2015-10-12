
function memoryDb(outputFunction) {
    var dbStore = {};
    var valueIndex = {};
    var journal = [];

    if(typeof outputFunction ==  'function'){
	this.output = outputFunction;
    }
    else {
	this.output = function(output){
	    console.log(output);
	};
    }

    this._journal = function(){
	return journal;
    };
    this._valueIndex = function(){
	return valueIndex;
    };
    this._dbStore = function(){
	return dbStore;
    };
    this._clear = function(){
	dbStore = {};
	valueIndex = {};
	journal = [];
    };

    this.setJournal = function (command, name, value) {
	// O(c)
	if (command != 'begin' && journal.length == 0) {
	    return;
	}
	journal.push([command, name, value]);
    };

    // SET name value – Set the variable name to the value value. Neither variable names nor values will contain spaces.
    this.set = function(name, value, setJournal) {
	// O(c)
	if(typeof value == 'undefined'){
	    throw 'bad value error';
	}
	var oldValue = dbStore[name];
	if (typeof oldValue != 'undefined') {
	    valueIndex[oldValue] = valueIndex[oldValue] -1;
	}
	dbStore[name] = value;
	if(typeof valueIndex[value] != 'undefined') {
	    valueIndex[value] = valueIndex[value] + 1;
	}
	else {
	    valueIndex[value] = 1;
	}
	if (setJournal){
	    this.setJournal('set', name, oldValue);
	}
    };

    // GET name – Print out the value of the variable name, or NULL if that variable is not set.
    this.get = function (name) {
	// O(c)
	if(typeof name =='undefined'){
	    throw 'bad key error';
	}
	else {
	    var value = dbStore[name];
	    if(typeof value == 'undefined') {
		this.output('NULL');
	    }
	    else {
		this.output(value);
	    }
	}
    };

    // UNSET name – Unset the variable name, making it just like that variable was never set.
    this.unset = function(name, setJournal) {
	// O(c)
	var oldValue = dbStore[name];
	dbStore[name] = undefined;
	if (typeof oldValue != 'undefined') {
	    valueIndex[oldValue] = valueIndex[oldValue] -1;
	}
	if (setJournal) {
	    this.setJournal('unset', name, oldValue);
	}
    };

    // NUMEQUALTO value – Print out the number of variables that are currently set to value. If no variables equal that value, print 0.
    this.numEqualTo = function(value) {
	//O(c)
	var num  = valueIndex[value];
	if (num){
	    this.output(''+num);
	}
	else {
	    this.output('0');
	}
    };

    // BEGIN – Open a new transaction block. Transaction blocks can be nested; a BEGIN can be issued inside of an existing block.
    this.begin = function(){
	this.setJournal('begin');
    };

    // ROLLBACK – Undo all of the commands issued in the most recent transaction block, and close the block. Print nothing if successful, or print NO TRANSACTION if no transaction is in progress.
    this.rollback = function(){
	if (journal.length == 0){
	    this.output('NO TRANSACTION');
	}
	else {
	    var command = journal.pop();
	    while(command[0] != 'begin'){

		if(command[0] == 'unset'){
		    this.set(command[1], command[2], false);
		}

		if(command[0] == 'set') {
		    if (typeof command[2] == 'undefined'){
			this.unset(command[1], false);
		    }
		    else {
			this.set(command[1], command[2], false);
		    }
		}
		command = journal.pop();
	    }
	}
    };

    // COMMIT – Close all open transaction blocks, permanently applying the changes made in them. Print nothing if successful, or print NO TRANSACTION if no transaction is in progress.
    this.commit = function() {
	if (journal.length == 0){
	    this.output('NO TRANSACTION');
	}
	else {
	    journal = [];
	}
    };

}


module.exports =  function(outputFunc) {
    return new memoryDb(outputFunc);
};
