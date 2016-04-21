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
   * Create captcha image from text with skewing, distortion, etc.
   * @return base64 image data
   */                         
  static text_to_image(Text) {
    var Width  = Text.length*security.CAPTCHA_HEIGHT;
    var Height = security.CAPTCHA_HEIGHT;  
    var Image  = pureimage.make(Width,Height);
    
    //??? 
  }
  
  /**
   * Get a visual captcha            
   * Text is a string of unicode icon characters
   * Image is PNG in base64  
   * @param Request containing a session cookie
   * @return {Text:"...",Picklist:"...",Image:"..."}
   */                      
  static get_captcha(Request) {
    var Cwd     = process.cwd();
    var Content = fs.readFileSync(Cwd+"/data/iconics.txt","utf8");
    
    //get iconic characters
    var Iconics = [];
    for (var Index=0; Index<Content.length; Index++) 
      if (Content.charCodeAt(Index)>255) {
        var Character = Content.charAt(Index);
        Iconics.push(Character);
      }   
      
    //randomly pick CAPTCHA_LENGTH iconics to make Text
    var Text = "";
    for (var Index=0; Index<security.CAPTCHA_LENGTH; Index++) {
      var Jndex     = Math.floor(Iconics.length*Math.random());
      var Character = Iconics[Jndex];
      Text += Character;
    }                   
                        
    //randomly add iconics to picklist
    var Picklist = Text;              
    for (var Index=security.CAPTCHA_LENGTH; Index<security.CAPTCHA_PICKLIST;
    Index++) {
      var Jndex     = Math.floor(Iconics.length*Math.random());
      var Character = Iconics[Jndex];
      Picklist += Character;  
    }     
    
    //create image for Text
    var Image = security.text_to_image(Text);
        
    //set captcha value in session
    session.set(Request,"Captcha",Text);
    
    //result
    return {
      Text:    Text,
      Picklist:Picklist,
      Image:   Image
    };
  }   
  
  /**
   * Verify a visual captcha   
   * @return true when captcha is matching
   */                       
  static verifty_captcha(Request,Text) {
    var Captcha = session.get(Request,"Captcha");
    return Text==Captcha;
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