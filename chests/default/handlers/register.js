
"use strict";

//nodejs modules
var sha1 = require("sha1");

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
      Password_Sha1:   sha1(Body.Username.toLowerCase()+Body.Password),
      Email:           Body.Email,
      Given_Name:      Body.Given_Name,
      Family_Name:     Body.Family_Name,
      Full_Name:       Body.Full_Name
    };       
                                      
    cb.counter("user",function(Error,Id){
      cb.insert_into("neaweb").values(Id.value,User).query({},
      function(Error,Results){
        if (Error)
          Response.json(Error);
        else
          Response.json(Results);
      });//insert
    });//counter    
  }
}

//nodejs exports
module.exports = register_handler;

//end of file