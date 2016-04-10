/**
 * Neaweb - Neat Web Framework
 * Freeware by Stinte Ltd
 * @file    Home requests handler
 * @version 0.1
 * @author  John Lowvale
 */
"use strict";

//project modules
var cb       = require(process.cwd()+"/modules/cb");
var security = require(process.cwd()+"/modules/security");

/**
 * Request handler on home scroll
 */                              
class home_handler {

  /**
   * Constructor
   */           
  constructor() {
    //
  }   
  
  /**
   * Handle get request
   */                   
  handle_get(Request,Response) {
    return security.PASSED; 
  }   
  
  /**
   * Handle post request
   */                   
  handle_post(Request,Response) {
    
    //test sql library query
    cb.select("*").where_type("user").
    query({},function(Error,Results){     
      //console.log("POST /home");
      //console.log("All users:");
      if (Error)
        console.log(Error);
      else {
        //console.log(Results);
        Response.json(Results);
      }
    });
  }   
} 
            
//nodejs exports
module.exports = home_handler; 
 
//end of file