/*
This file was added by Kevin Gage on 7/12/2015
The intent is to give an interface to controll the LED states through exposed
methods while not cluttering up server.js

The LED function takes two parameters.  The first should be an integer that
represents a gpio pin on the raspberry pi which is connected to an led.
The second parameter is optional.  If the second paremeter is false
 the LED should turn off.  Otherwise it will turn on.

Since the 'off' option runs cleanup on the gpio pin it's best to shut
all LEDs off before ending the program.
*/

var Gpio = require('onoff').Gpio;

var LED = function (pinNumber, ledState) {
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
This function is called with two parameters.  The first paramater should be an array of json objects that fit this 
format with an arbitrary number of gpio pin numbers.  each gpio pin represents a connection to a LED {delay: value, gpio#: bool, gpio#: bool}
The second paramter should be a callback function that takes one parameter.  The callback function will be passed an error message if an error occurs

example LEDBatch([{delay: 0, 1: true, 2: true, 3: true}, {delay: 5, 1: false, 2: false}], function(er){console.log(er)})
*/

var LEDBatch = function(jsonArray, callback) {
	var error = LEDBatchVerify(jsonArray, callback);
	
	if (error != '') {
		callback(error);
		return;
	}

	var totalDelay = 0;
	
	function runTimeout(gpioPin, state, delay){
		setTimeout(function() {
			LED(gpioPin, state);
		}, delay);
	}
	
	for (var i = 0; i < jsonArray.length; i++){
		totalDelay += jsonArray[i].delay;
		
		for (var p in jsonArray[i]) {
			if (p != 'delay'){
				runTimeout(p,jsonArray[i][p], totalDelay * 1000);
			}
		}
	}
	callback(error);
}

/*
This function is used to verify all of the information that is passed to LEDBatch and gracefully handle errors
*/
function LEDBatchVerify(jsonArray, callback){
	//check first input is array of json items.  Check properties of json to make sure they are valid
	if(!(Array.isArray(jsonArray))) {
		return 'Invalid variable passed to LEDBatch.  Must be array';
	}
	for (var i = 0; i < jsonArray.length; i++){
		
//	cant get this verification to work.  JSON.parse keeps failing even though JSON looks valid
//		try {
//			JSON.parse(jsonArray[i]);
//		} catch (e) {
//			return 'Invalid json found in jsonArray passed to LEDBatch';
//		}
		
		if (isNaN(jsonArray[i].delay)){
			return 'Invalid delay value found in json object passed to LEDBatch';
		}
		
		for (var p in jsonArray[i]){
			if (p != 'delay'){
				if(isNaN(p)){
					return 'Invalid gpio value found in json passed to LEDBatch. Must be a number';
				}
				if(jsonArray[i][p] != true && jsonArray[i][p] != false){
					return 'Invalid light state found in json passed to LEDBatch.  Must be bool';
				}
			}
		}
	}
	
	//check that second item is callback function
	if (typeof(callback) != 'function') {
		return 'Invalid callback function passed to LEDBatch';
	}
	
	//check callback function to make sure it takes one argument????
	
	return '';
}
exports.LED = LED;
exports.LEDBatch = LEDBatch;
