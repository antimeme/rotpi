/*
This file was added by Kevin Gage on 7/12/2015
The intent is to give an interface to controll the LED states through exposed
methods while not cluttering up server.js

The LED function takes two parameters.  The first should be an integer that
represents a gpio pin on the raspberry pi which is connected to an led.
The second parameter is optional.  If the second paremeter is the exact 
string 'off' the LED should turn off.  Otherwise it will turn on.

Since the 'off' option runs cleanup on the gpio pin it's best to shut
all LEDs off before ending the program.
*/

var Gpio = require('onoff').Gpio;

var LED = function (pinNumber, ledState) {
	if (isNaN(pinNumber)) {
		throw new Error('Invalid pin number');
	}

	var led = new Gpio(pinNumber, 'out');

	if (ledState === 'off') {
		led.unexport();
	}
	else{
		led.writeSync(1);
	}
}

module.exports = LED;
