/* Client's script. */

//Defines that JavaScript code that should be executed in "strict mode".
//It is not a statement, but a literal expression, ignored by earlier versions of JavaScript.
//The purpose of "use strict" is to indicate that the code should be executed in "strict mode"
//With strict mode, you can not, for example, use undeclared variables.
//Source: http://www.w3schools.com/js/js_strict.asp
"use strict";

//Variables.
var config_file = "";
var users_inputs = "";
var inputs_history = "";
var menuType = "none";

//Load a file from local disk.
function loadFile(event)
{
  //Get the file in order to get the filename.
  var input = event.target;
  var file = input.files[0];
  
  var reader = new FileReader();
  
  //Called when the file is loaded.
  reader.onload = 
  (
    function(theFile)
    {
      return function(event)
      {
        var fileContent = "";
        fileContent = event.target.result;
        
        
        //Process the right menu type/file.
        if (menuType == "load_config_mni")
        {
          loadConfig(fileContent);
        }
        else if (menuType == "load_users_inputs_mni")
        {
          loadUsersInputs(fileContent);
        }
        else if (menuType == "load_inputs_history_mni")
        {
          loadInputsHistory(fileContent);
        }
        
      };
    }
  )(file);
  
  //Read the file, if the file is defined.
  if (file != undefined)
  {
    reader.readAsText(file);
    
    //Hack to force "change" event next time.
    $("#load_file").val('');
  }
}

//Save a file to local disk.
function saveFile()
{
  //Get the filename.
  var filename = $("#text-filename").val();
  
  //If no filename is specified, use a default filename.
  if((typeof filename === "undefined") || (filename === null ) || 
    (filename.trim() == ""))
  {
    filename = "client_file";
  }
  
  //Add the ".txt" file extension.
  filename = filename + ".txt";
  
  //Process the right menu type/file.
  //Get the file contents.
  var text = "";
  if (menuType == "save_config_mni")
  { 
    text = getConfigFile();
  }
  else if (menuType == "save_users_inputs_mni")
  {
    text = getUsersInputsFile();
  }
  else if (menuType == "save_inputs_history_mni")
  {
    text = getInputsHistoryFile();
  }
  
  //Create the blob.
  var filecontent = [text];
  var blob = new Blob(filecontent, {menuType: "text/plain;charset=utf-8"});
  
  //Save the blob as a file to local disk.
  if((typeof blob !== "undefined") && (blob !== null ))
  {
    saveAs(blob,filename);
  }
}


/* *** Load files *** */

//Load the Configuration File.
function loadConfig(file)
{
  config_file = file;
}

//Load the Users Inputs.
function loadUsersInputs(file)
{
  users_inputs = file;
}

//Load the Inputs History.
function loadInputsHistory(file)
{
  inputs_history = file;
}


/* *** Save files *** */

//Get the Configuration File's Content.
function getConfigFile()
{
  return config_file;
}

//Get the Users Inputs File's Content.
function getUsersInputsFile()
{
  return users_inputs;
}

//Get the Inputs History's Content.
function getInputsHistoryFile()
{ 
  return inputs_history;
}

//Executed when the page can be 
//manipulated safely by JavaScipt.
$(function ()
{  
  //Change all HTML buttons to JQuery UI buttons.
  $("button").button();
  
  //Create the "About" jQuery dialog.
  $("#about_dialog").dialog
  (
    {
      buttons: 
      { 
        "OK": function () 
        {         
          $(this).dialog( "close" );
        },
      },
      resizable: false,
      autoOpen: false,
      modal: true
    }
  );
  
  //Open the "About" dialog when the user
  //clicks on the "About" menu item.
  $("#about").on
  (
    "click",
    function(event)
    {
      $("#about_dialog").dialog("open");
    }
  );
  
  //Create the "Save" jQuery dialog.
  $("#save_dialog").dialog
  (
    {
      buttons: 
      { 
        "OK": function () 
        {         
          $(this).dialog( "close" ); 
          saveFile();
        },
        "Cancel": function () 
        {         
          $(this).dialog( "close" ); 
        },
      },
      width: 450,
      resizable: false,
      autoOpen: false,
      modal: true
    }
  );
  
  
  /* *** Config file *** */
  
  $("#load_config_mni").on
  (
    "click",
    function(event)
    {
      menuType = "load_config_mni";
      $("#load_file").trigger("click");
    }
  );
  
  $("#save_config_mni").on
  (
    "click",
    function(event)
    {
      menuType = "save_config_mni";
      $("#saving_text").text("Saving Config File...");
      $("#save_dialog").dialog("open");
    }
  );
  
  
  /* *** Users Inputs *** */
  
  $("#load_users_inputs_mni").on
  (
    "click",
    function(event)
    {
      menuType = "load_users_inputs_mni";
      $("#load_file").trigger("click");
    }
  );
  
  $("#save_users_inputs_mni").on
  (
    "click",
    function(event)
    {
      menuType = "save_users_inputs_mni";
      $("#saving_text").text("Saving Users Inputs...");
      $("#save_dialog").dialog("open");
    }
  );
  
  
  /* *** Inputs History. *** */
  
  $("#load_inputs_history_mni").on
  (
    "click",
    function(event)
    {
      menuType = "load_inputs_history_mni";
      $("#load_file").trigger("click");
    }
  );
  
  $("#save_inputs_history_mni").on
  (
    "click",
    function(event)
    {
      menuType = "save_inputs_history_mni";
      $("#saving_text").text("Saving Inputs History...");
      $("#save_dialog").dialog("open");
    }
  );
  
  //Load actual config file.
  $("#load_file").on
  (
    "change",
    function(event)
    {
      loadFile(event);
    }
  );
  
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
  //get_time();
 
});




