
"use strict";

//project modules
var cb    = require(process.cwd()+"/modules/cb");
var utils = require(process.cwd()+"/modules/utils");

class register_handler {

  constructor() {
  }
  
  handle_get(Request,Response) {
  }
  
  handle_post(Request,Response) {
    var Body = Request.body;
    
    //user object
    var User = {
      Type:            "USER",
      Username:        Body.Username,
      Password_Sha1:   utils.sha1(Body.Username.toLowerCase()+Body.Password),
      Email:           Body.Email,
      Given_Name:      Body.Given_Name,
      Family_Name:     Body.Family_Name,
      Full_Name:       Body.Full_Name
    };       
                                      
    cb.next_id("user",function(Error,Next_Id){
      if (Error) {
        console.log("Error in 'register_handler/handle_post':");
        console.log(Error+"\n");
        Response.json({Error:Error});
        return;
      }

      cb.insert().values(Next_Id,User).query({},
      function(Error,Results){
        if (Error)
          Response.json({Error:Error});
        else
          Response.json({Id:Next_Id});
      });//insert
    });//next id    
  }
}

//nodejs exports
module.exports = register_handler;

//end of file