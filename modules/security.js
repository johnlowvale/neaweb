/**
 * Neaweb - Neat Web Framework with Full Stack JavaScript
 * Freeware by Stitec Ltd
 * @file    Security class file
 * @version 0.1
 * @author  John Lowvale 
 */
"use strict";

//library modules
var pureimage = require("pureimage");

//project modules
var session = require("./session");

/**
 * Security class
 */
class security {

  /**
   * Constructor
   */           
  constructor() {
    //
  }  
  
  /**
   * Get a visual captcha            
   * Text is a string of unicode icon characters
   * Image is PNG in base64  
   * @param Request containing a session cookie
   * @return {Text:"...",Image:"..."}
   */                      
  static get_captcha(Request) {
    //
  }   
  
  /**
   * Verify a visual captcha
   */                       
  static verifty_captcha(Request,Text) {
    //
  }
}

//static properties
security.PASSED = "SECURITY_PASSED";
security.FAILED = "SECURITY_FAILED";

//nodejs exports
module.exports = security;

//end of file