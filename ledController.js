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
		led.writeSync(1);
	}
}


/*
This function is called with at least two arguments.  All arguments except for the last one should be a java object which contains a delay and 
at least one pin:state pair.
each gpio pin represents a connection to a LED 
exampe: {delay: value, gpio#: bool, gpio#: bool}
The final argument should be a callback function that takes one argument.  The callback function will be passed an error message if an error occurs

example LED({delay: 0, 1: true, 2: true, 3: true}, {delay: 5, 1: false, 2: false}, function(er){console.log(er)})
*/

var LED = function() {

	var error = LEDVerify(arguments);

	//check that last argument is callback function. can't respond with callback since we didn't get it...
	if (typeof(arguments[arguments.length - 1]) != 'function') {
		var error = 'Invalid callback function passed to LED: ' + JSON.stringify(arguments[arguments.length - 1]);
		throw error;
	}

	if (error != '') {
		arguments[arguments.length - 1](error);
		return;
	}

	var totalDelay = 0;
	
	function runTimeout(gpioPin, state, delay){
		setTimeout(function() {
			SetState(gpioPin, state);
		}, delay);
	}

	for (var i = 0; i < arguments.length - 1; i++){
		totalDelay += arguments[i].delay;
		
		for (var p in arguments[i]) {
			if (p != 'delay'){
				runTimeout(p,arguments[i][p], totalDelay);
			}
		}
	}
	
	arguments[arguments.length - 1](error);
}

/*
This function is used to verify all of the information that is passed to LED and gracefully handle errors
*/
function LEDVerify(){ 
	arguments = arguments[0];

	//make sure there are at least 2 arguments
	if (arguments.length < 2) {
		return 'Invalid call to LED.  Must contain at least two arguments.  One object and one callback function';
	}
	
	for (var i = 0; i < arguments.length - 1; i++) {
		//check all arguments before last to make sure they have a delay and its value is a number
		if (isNaN(arguments[i].delay)){
			return 'Invalid delay value found in object passed to LED: ' +  JSON.stringify(arguments[i]);
		}
		
		for (var p in arguments[i]){
			//check all arguments before last to make sure their properties are numbers, other than delay
			if (p != 'delay' && isNaN(p)){
				return 'Invalid gpio value found in object passed to LED. Must be a number: ' +  JSON.stringify(arguments[i]);
			}
			
			//check all arguments before last to make sure their property values are bool, other than delay
			if (p != 'delay' && arguments[i][p] != true && arguments[i][p] != false) {
				return 'Invalid light state found in object passed to LEDBatch.  Must be bool: ' + JSON.stringify(arguments[i]);
			}
		}
	}

	return '';
}
exports.LED = LED;
