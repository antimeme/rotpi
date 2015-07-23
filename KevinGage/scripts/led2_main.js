/*
To do:
1 auto scroll when divs are added?
2 output for errors
3 more styling
*/
var led1 = "17";
var led2 = "22";
var led3 = "19";

$(document).ready(function() {
	

	
	$(".led").click(function() { 
		$(this).toggleClass("on");
	});
	
	$("#add").click(function() {
		
		if (isNaN($("#delay").val()) || $("#delay").val() == ""){
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
		
		$(dwrapper).hover(function() {
			$(this).css({border: '0 solid black'}).animate({borderWidth: 4}, 500);
		}, function() {
			$(this).animate({borderWidth: 0}, 500);
		});
	
		$(dwrapper).click(function() {
			$(this).remove();
		});
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
		
		var ledCommandObject = {};
		ledCommandObject["delay"] = 0;
		ledCommandObject[led1] = ledState1;
		ledCommandObject[led2] = ledState2;
		ledCommandObject[led3] = ledState3;
		
		ledCommandArray[0] = JSON.stringify(ledCommandObject);
		
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
			
			
			ledCommandObject["delay"] = delayTime * 1000;
			ledCommandObject[led1] = ledState1;
			ledCommandObject[led2] = ledState2;
			ledCommandObject[led3] = ledState3;
		
			ledCommandArray.push(JSON.stringify(ledCommandObject));
		}
		
		previousLedState = $( $('#queue').children().last() );
		
		delayTime = $( $(previousLedState).children()[0]).text();
		
		
		ledCommandObject["delay"] = delayTime * 1000;
		ledCommandObject[led1] = 0;
		ledCommandObject[led2] = 0;
		ledCommandObject[led3] = 0;
		
		ledCommandArray.push(JSON.stringify(ledCommandObject));
		
		$.post("/LED",
		{
			'ledCommand[]': ledCommandArray
		},
		function(data, status){
			alert("Data: " + data + "\nStatus: " + status);
		});
	});
});