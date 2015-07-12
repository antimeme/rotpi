/*
Written by Kevin Gage on 7/12/2015

Test turning on an led for a set period of time using ledController.js script.

Usage: node blink.js {gpio pin} {time in seconds}

Example Usage: node blink.js 17 10
this example will turn an LED on gpio pin 17 for 10 seconds
*/

var ledController = require('../ledController.js');
var pinNumber = process.argv[2];
var blinkLength = process.argv[3];

if (isNaN(pinNumber) || isNaN(blinkLength)) {
	console.log('Invalid pin number or blink length');
	process.exit(1);
}

ledController.LED(pinNumber, 'on');

setTimeout(function() {
	ledController.LED(pinNumber, 'off')
}, blinkLength * 1000);
