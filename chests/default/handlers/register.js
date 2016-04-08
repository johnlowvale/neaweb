
"use strict";

//project modules
var cb = require(process.cwd()+"/modules/cb");

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
      Password:        Body.Password,
      Password_Confirm:Body.Password_Confirm,
      Email:           Body.Email,
      Given_Name:      Body.Given_Name,
      Family_Name:     Body.Family_Name,
      Full_Name:       Body.Full_Name
    };       
    
    cb.insert_into("neaweb").values("xxx",User).query({},
    function(Error,Results){
      if (Error)
        Response.json(Error);
      else
        Response.json(Results);
    });    
  }
}

//nodejs exports
module.exports = register_handler;

//end of file