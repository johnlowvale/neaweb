/**
 * Neaweb - Neat Web Framework
 * Freeware by Stinte Ltd
 * @file    Test Class
 * @author  John Lowvale
 * @version 0.1
 */
"use strict";

/**
 * Test class
 */
class test {

  /**
   * Constructor
   */
  constructor() {
    //
  }
  
  /**
   * Static method
   */
  static hello_world() {
    console.log("Hello, World!");
  }
  
  /**
   * Dynamic method
   */
  hi() {
    console.log("Hi!");
  }
}//class test

//nodejs export
module.exports = test;

//end of file