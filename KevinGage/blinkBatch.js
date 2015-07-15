/*
Written by Kevin Gage on 7/12/2015

Testing the LEDBatch function from ledController.js using LED's on GPIO pins
17, 22, and 19 

uasge: node blinkBatch.js
*/

var ledController = require('../ledController.js');

var mybatch = [{delay:1, 17:true, 22:true, 19:true},{delay:2, 22:false},{delay:3, 17:false, 22:false, 19:false}];

ledController.LEDBatch(mybatch, function(err){
	console.log(err);
});
