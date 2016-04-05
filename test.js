/**
 * Neaweb - Neat Web Framework
 * Freeware by Stinte Ltd
 * @file    Framework test file
 * @version 0.1
 * @author  John Lowvale
 */
"use strict"; 
 
//project modules
var cb   = require("./modules/cb");
var test = require("./modules/test");

//log out imported module
console.log(test);

//test static method
test.hello_world();

//test dynamic method
var Test = new test();
Test.hi();

//create connection to db
cb.connect("localhost","neaweb");

//test view query
cb.view_query("dev_users","find_user",function(Error,Results){
  console.log("view_query:");
  if (Error)
    console.log(Error);
  else
    console.log(Results[0]);
});

//test raw sql query
cb.sql_query("select * from neaweb where Type='USER'",function(Error,Results){
  console.log("sql_query:");
  if (Error)
    console.log(Error);
  else
    console.log(Results);
});

//test sql library query
cb.select("*").type("user").query(function(Error,Results){
  console.log("query:");
  if (Error)
    console.log(Error);
  else
    console.log(Results);
});

//end of file