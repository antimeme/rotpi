/*
To do:
1 auto scroll when divs are added?
2 click a queue div to remove it
3 click go send ajax
4 output for errors
5 more styling
*/
var led1 = "17";
var led2 = "22";
var led3 = "19";

$(document).ready(function() {
	
	$(".led").click(function() { 
		$(this).toggleClass("on");
	});
	
	$("#add").click(function() {
		
		if (isNaN($("#delay").val())){
			return;
		}
		
		dwrapper=document.createElement('div');
		d1=document.createElement('div');
		d2=document.createElement('div');
		d3=document.createElement('div');
		delayP=document.createElement('p');
		
		$(dwrapper).addClass("miniLedWrapper");
		
		if ($("#led1").hasClass("on")) {
			$(d1).addClass("on");
		}
		if ($("#led2").hasClass("on")) {
			$(d2).addClass("on");
		}
		if ($("#led3").hasClass("on")) {
			$(d3).addClass("on");
		}
		
		$(d1).addClass("miniLed");
		$(d2).addClass("miniLed");
		$(d3).addClass("miniLed");
		
		$(delayP).text($("#delay").val());

		$(dwrapper).append(delayP);		
		$(dwrapper).append(d1);
		$(dwrapper).append(d2);
		$(dwrapper).append(d3);
	
		$("#queue").append(dwrapper);
	});
	
	$("#go").click(function() { 
		if ($("#queue > div").length < 1){
			return;
		}
		
		var ledCommandArray = [];
		
		var ledState = $( $('#queue').children()[1] ); 
		
		var delayTime = 0;
		
		var mini1 = $(ledState).children()[1];
		var mini2 = $(ledState).children()[2];
		var mini3 = $(ledState).children()[3];
		
		var ledState1 = $(mini1).hasClass("on");
		var ledState2 = $(mini2).hasClass("on");
		var ledState3 = $(mini3).hasClass("on");
		
		ledCommandArray[0] = {"delay":delayTime, led1:ledState1, led2:ledState2, led3:ledState3};
		
		var previousLedState = "";
		
		for (var i = 2; i < $("#queue").children().length; i++){
			previousLedState = $( $('#queue').children()[i - 1] );
			
			delayTime = $( $(previousLedState).children()[0]).text();
			
			ledState = $( $('#queue').children()[i] );
			
			mini1 = $(ledState).children()[1];
			mini2 = $(ledState).children()[2];
			mini3 = $(ledState).children()[3];
			
			ledState1 = $(mini1).hasClass("on");
			ledState2 = $(mini2).hasClass("on");
			ledState3 = $(mini3).hasClass("on");
			
			ledCommandArray.push({"delay":delayTime, led1:ledState1, led2:ledState2, led3:ledState3});
		}
		
		previousLedState = $( $('#queue').children().last() );
		
		delayTime = $( $(previousLedState).children()[0]).text();
		
		ledCommandArray.push({"delay":delayTime, led1:0, led2:0, led3:0});
		
		alert(ledCommandArray);
	});
});