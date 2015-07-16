/*
This file was added by Kevin Gage on 7/12/2015
The intent is to give an interface to controll the LED states through exposed
methods while not cluttering up server.js

The SetState function takes two arguments.  The first should be an integer that
represents a gpio pin on the raspberry pi which is connected to an led.
The second argument is optional.  If the second argument is false
 the LED should turn off.  Otherwise it will turn on.

Since the 'off' option runs cleanup on the gpio pin it's best to shut
all LEDs off before ending the program.
*/

var Gpio = require('onoff').Gpio;

var SetState = function (pinNumber, ledState) {
	if (isNaN(pinNumber)) {
		throw new Error('Invalid pin number');
	}

	var led = new Gpio(pinNumber, 'out');

	if (ledState == false) {
		led.unexport();
	}
	else{
		led.write(1);
	}
}


/*
This function is called with two arguments.  The first argument should be an array of java objects 
each of which contains a delay and at least one pin:state pair.
each gpio pin represents a connection to a LED 
exampe: {delay: value, gpio#: bool, gpio#: bool}
The second argument should be a callback function that takes one argument.  
The callback function will be passed an error message if an error occurs

example LED([{delay: 0, 1: true, 2: true, 3: true}, {delay: 5, 1: false, 2: false}], function(er){console.log(er)})
*/

var LED = function(ledInstructions, cb) {
	
	//check that last argument is callback function. can't respond with callback since we didn't get it...
	if (typeof(cb) != 'function') {
		var error = 'Invalid callback function passed to LED: ' + JSON.stringify(cb);
		throw error;
	}

	var error = LEDVerify(ledInstructions, cb);

	if (error != '') {
		cb(error);
		return;
	}

	var totalDelay = 0;
	
	function runTimeout(gpioPin, state, delay){
		setTimeout(function() {
			SetState(gpioPin, state);
		}, delay);
	}

	for (var i = 0; i < ledInstructions.length; i++){
		totalDelay += ledInstructions[i].delay;
		
		for (var p in ledInstructions[i]) {
			if (p != 'delay'){
				runTimeout(p,ledInstructions[i][p], totalDelay);
			}
		}
	}
	
	cb(error);
}

/*
This function is used to verify the information that is passed to LED and gracefully handle errors
*/
function LEDVerify(ledInstructions, cb){ 

	//make sure ledInstructions is an array
	if (!(ledInstructions instanceof Array)) {
		return 'Invalid array passed to LED: ' +  JSON.stringify(ledInstructions);
	}

	for (var i = 0; i < ledInstructions.length; i++) {
		//check all arguments before last to make sure they have a delay and its value is a number
		if (isNaN(ledInstructions[i].delay)){
			return 'Invalid delay value found in object passed to LED: ' +  JSON.stringify(ledInstructions[i]);
		}
		
		for (var p in ledInstructions[i]){
			//check all objects in ledInstructions array to make sure their properties are numbers, other than delay
			if (p != 'delay' && isNaN(p)){
				return 'Invalid gpio value found in object passed to LED. Must be a number: ' +  JSON.stringify(ledInstructions[i]);
			}
			
			//check all objects in ledInstructions array to make sure their property values are bool, other than delay
			if (p != 'delay' && ledInstructions[i][p] != true && ledInstructions[i][p] != false) {
				return 'Invalid light state found in object passed to LEDBatch.  Must be bool: ' + JSON.stringify(ledInstructions[i]);
			}
		}
	}

	return '';
}
exports.LED = LED;
