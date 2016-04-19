/**
 * Neaweb - Neat Web Framework in Full-stack JavaScript
 * Freeware by Stitec Ltd
 * @file    Session class file
 * @version 0.1 
 * @author  John Lowvale
 */         
"use strict";

//in-project classes
var utils = require("./utils");

/**
 * Session class
 */             
class session {

  /**
   * Constructor
   */           
  constructor() {   
    //    
  }   
       
  /**
   * Check session to start or resume
   */
  static check_session(Request,Response) {
    var Session_Id = Request.cookies.session;
    
    //session id not present in cookies, create new session.
    if (Session_Id==null) {                  
    
      //create a hash not yet in sessions array
      var Sha256 = utils.sha256(Math.random().toString());
      while (session.Entries[Sha256]!=null)
        Sha256 = utils.sha256(Math.random().toString());  
        
      //create session
      session.Entries[Sha256] = {};  
      Response.cookie("session",Sha256,{
        expires:utils.date_from_today(session.SESSION_COOKIE_LIFETIME)
      });
    }
    
    //session id present in cookies
    else {                 
      
      //session id present in cookies but not in server sessions
      //create new session
      if (session.Entries[Session_Id]==null) 
        session.Entries[Session_Id] = {};
        
      //session id present in cookies and present in sessions
      //use existing session 
      else { 
        //no operations
      }    
    }//session id in cookies
  }
  
  /**
   * Set a session variable
   * Requires existing session created by 'check_session'
   */                      
  static set(Request,Name,Value) {
    var Session_Id = Request.cookies.session;
    if (Session_Id==null)
      return;
                                              
    //set value
    session.Entries[Session_Id][Name] = Value;    
  }            
  
  /**
   * Get a session variable                              
   * Requires existing session created by 'check_session'
   */                      
  static get(Request,Name) {
    var Session_Id = Request.cookies.session;
    if (Session_Id==null)
      return null;
    
    //get value
    return session.Entries[Session_Id][Name];
  }
}

//constants
session.SESSION_COOKIE_LIFETIME = 365; //days              

//static properties
session.Entries = {};

//nodejs exports
module.exports = session;

//end of file