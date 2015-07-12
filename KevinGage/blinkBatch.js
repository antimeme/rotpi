/*
Written by Kevin Gage on 7/12/2015

Testing the LEDBatch function from ledController.js using LED's on GPIO pins
17, 22, and 19 

uasge: node blinkBatch.js
*/

var ledController = require('../ledController.js');

ledController.LEDBatch([17,22,19], ['on','off','on']);

setTimeout(function() {
        ledController.LEDBatch([17,22,19],['off',,'off']);

	setTimeout(function() {
		ledController.LEDBatch([17,22,19],['off','off','off']);
	}, 2000);
}, 5000);

