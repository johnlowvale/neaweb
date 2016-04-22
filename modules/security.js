/**
 * Neaweb - Neat Web Framework with Full Stack JavaScript
 * Freeware by Stitec Ltd
 * @file    Security class file
 * @version 0.1
 * @author  John Lowvale 
 */
"use strict";

//nodejs modules
var fs = require("fs");

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
   * Create captcha image from list of images
   * Resulting captcha image is distorted
   * @return base64 image data
   */                         
  static images_to_captcha(Images) {
    var Width  = Images.length*security.CAPTCHA_HEIGHT;
    var Height = security.CAPTCHA_HEIGHT;  
    var Image  = pureimage.make(Width,Height);
    
    //??? 
  }
  
  /**
   * Get a visual captcha            
   * Captlist (captcha image list) is a list of images to make captcha image
   * Picklist is a list of images as choices for user to choose
   * Image is the resulting image made from Captlist
   * @param Request containing a session cookie
   * @return {Captlist:"...",Picklist:"...",Image:"..."}
   */                      
  static get_captcha(Request) {
    //
  }   
  
  /**
   * Verify a visual captcha   
   * @return true when captcha is matching
   */                       
  static verifty_captcha(Request,Captlist) {
    //
  }
}

//constants
security.PASSED = "SECURITY_PASSED";
security.FAILED = "SECURITY_FAILED";
security.CAPTCHA_LENGTH   = 6;   //characters
security.CAPTCHA_PICKLIST = 36;  //characters
security.CAPTCHA_HEIGHT   = 100; //px

//nodejs exports
module.exports = security;

//end of file