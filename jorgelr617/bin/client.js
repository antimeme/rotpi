/* Client's script. */
$(function () 
{
  //Defines that JavaScript code that should be executed in "strict mode".
  //It is not a statement, but a literal expression, ignored by earlier versions of JavaScript.
  //The purpose of "use strict" is to indicate that the code should be executed in "strict mode"
  //With strict mode, you can not, for example, use undeclared variables.
  //Source: http://www.w3schools.com/js/js_strict.asp
  "use strict";
  
  //For better performance - to avoid searching in DOM.
  var content = $('#content');
  var input = $('#input');
  var status = $('#status');
  
  //Get the server's time.
  function get_time() 
  {
    $.ajax
    ( 
      {
        
        url : "http://localhost:8080/time",
        success : function (data, textStatus, jqXHR)
        {
          document.write("data = " + data + "<br>" );
          document.write(" textStatus = " + textStatus + "<br>");
        },
        error : function(jqXHR, textStatus, errorThrown)
        {
          document.write("textStatus =  " + textStatus + "<br>");
          document.write(" errorThrown = " + errorThrown + "<br>");
          document.write("<br>Make sure the server is running first before running the client!");
        }
      }
    )    
  }
  
  //Get the actual server time.
  get_time();
  
  /**
   * Send message when user presses the Enter key.
   */
  input.on
  (
    'keydown',
    function(event)
    {
      if (event.keyCode === 13) 
      {
        //Get the message.
        var msg = $(this).val();
        
        //Send the message to the server.
        /* *** Code for sending message. *** */
        
        //Clear the message. 
        $(this).val('');
        
        //Disable the input field to make the user waits until server
        //sends back response.
        input.attr('disabled', 'disabled');
  
      }
    }
  );
    
  /**
   *  Make it a little more user friendly
   */
  var scrollbar = $('body > section:first').tinyscrollbar();
  
  function slideScrollbar() 
  {
    scrollbar.update();
    scrollbar.move(Math.max(0, content.find('> p').length - 9) * 18);
  }
    
});




