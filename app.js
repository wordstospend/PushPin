
var memDB = require('./memDb')(function(value){ process.stdout.write(value +'\n'); });

process.stdin.setEncoding('utf8');
var inputBuffer = "";

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
    if (chunk !== null) {
	inputBuffer += chunk;
	var inputArray = inputBuffer.split('\n');
	inputArray.forEach(function(element) {
	    if(element.length > 0){
		processCmd(element);
	    }

	});
	inputBuffer = "";
    }
});

process.stdin.on('end', function() {

});


var errorString = "bad command format error";
function processCmd(input) {

    var cmd = input.split(/\s+/);
    switch(cmd[0]) {
    case 'SET':
	if(cmd.length != 3){
	    throw errorString;
	}
	memDB.set(cmd[1], cmd[2], true);
        break;
    case 'GET':
	if(cmd.length != 2){
	    throw errorString;
	}
	memDB.get(cmd[1]);
        break;
    case 'UNSET':
	if(cmd.length != 2){
	    throw errorString;
	}
	memDB.unset(cmd[1]);
	break;
    case 'NUMEQUALTO':
	if(cmd.length != 2){
	    throw errorString;
	}
	memDB.numEqualTo(cmd[1]);
	break;
    case 'BEGIN':
	if(cmd.length != 1){
	    throw errorString;
	}
	memDB.begin();
	break;
    case 'ROLLBACK':
	if(cmd.length != 1){
	    throw errorString;
	}
	memDB.rollback();
	break;
    case 'COMMIT':
	if(cmd.length != 1){
	    throw errorString;
	}
	memDB.commit();
	break;
    case 'END':
	if(typeof process.stdin.end == 'function'){
	    process.stdin.end();
	}
	break;

    default:
        throw 'error unknown command "' + cmd[0] + '" "' + input + '"'  ;
    }

}
