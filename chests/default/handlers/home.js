/**
 * Neaweb - Neat Web Framework
 * Freeware by Stinte Ltd
 * @file    Home requests handler
 * @version 0.1
 * @author  John Lowvale
 */
"use strict";

//project modules
var cb = require(process.cwd()+"/modules/cb");

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
    //
  }   
  
  /**
   * Handle post request
   */                   
  handle_post(Request,Response) {
    cb.connect("localhost","neaweb");
    
    //test sql library query
    cb.select("*").type("user").query(function(Error,Results){
      console.log("query:");
      if (Error)
        console.log(Error);
      else {
        console.log(Results);
        Response.json(Results);
      }
    });
  }   
} 
            
//nodejs exports
module.exports = home_handler; 
 
//end of file