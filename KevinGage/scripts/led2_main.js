$(document).ready(function() {
	
	$(".led").click(function() { 
		$(this).toggleClass("on");
	});
	
	$("#add").click(function() {
		dwrapper=document.createElement('div');
		d1=document.createElement('div');
		d2=document.createElement('div');
		d3=document.createElement('div');
		delayP=document.createElement('p');
		
		$(dwrapper).addClass("miniLedWrapper");
		
		$(d1).addClass("on");
		$(d2).addClass("on");
		$(d3).addClass("on");
		
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
});