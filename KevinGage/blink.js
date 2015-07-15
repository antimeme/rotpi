/*
Written by Kevin Gage on 7/12/2015

Testing the LEDBatch function from ledController.js using LED's on GPIO pins
17, 22, and 19 

uasge: node blinkBatch.js
*/

var ledController = require('../ledController.js');

ledController.LED({delay:0, 17:true, 22:true, 19:true},{delay:2000, 22:false},{delay:3000, 17:false, 22:false, 19:false}, function(err){
	console.log(err);
});
