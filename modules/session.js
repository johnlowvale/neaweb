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
    var Session_Id = Request.cookies.Session;
    
    //session id not present in cookies, create new session.
    if (Session_Id==null) {                  
    
      //create a hash not yet in sessions array
      var Sha256 = utils.sha256(Math.random().toString());
      while (session.Entries[Sha256]!=null)
        Sha256 = utils.sha256(Math.random().toString());  
        
      //create session
      session.Entries[Sha256] = {};  
      Response.cookie("Session",Sha256,{
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
    var Session_Id = Request.cookies.Session;
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
    var Session_Id = Request.cookies.Session;
    if (Session_Id==null)
      return null;
    
    //get value
    return session.Entries[Session_Id][Name];
  }      
  
  /**
   * Set authorised                         
   * Value is boolean value or null
   */              
  static set_authorised(Request,Value,Content_Name) {
    if (Content_Name==null)
      session.set(Request,"Authorised",Value);
    else
      session.set(Request,"Authorised-To-"+Content_Name,Value);
  }     
  
  /**
   * Get authorised
   */              
  static get_authorised(Request,Content_Name) {
    if (Content_Name==null)
      session.get(Request,"Authorised");
    else
      session.get(Request,"Authorised-To-"+Content_Name);
  }
   
  /**
   * Make authorised
   */                
  static make_authorised(Request,Content_Name) {
    if (Content_Name==null)
      session.set_authorised(Request,true);
    else
      session.set_authorised(Request,true,Content_Name);
  }
  
  /**
   * Check if authorised
   */                   
  static is_authorised(Request,Content_Name) {
    if (Content_Name==null) {
      if (session.get_authorised(Request)==true)
        return true;
      else
        return false;          
    }
    else {           
      if (session.get_authorised(Request,Content_Name)==true)
        return true;
      else
        return false;
    }
  }          
  
  /**
   * Clear authorised
   */                
  static clear_authorised(Request,Content_Name) {
    if (Content_Name==null)
      session.set_authorised(Request,null);
    else
      session.set_authorised(Request,null,Content_Name);
  }
}

//constants
session.SESSION_COOKIE_LIFETIME = 365; //days              

//static properties
session.Entries = {};

//nodejs exports
module.exports = session;

//end of file