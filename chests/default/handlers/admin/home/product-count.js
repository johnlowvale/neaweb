
"use strict";

var cb = require(process.cwd()+"/modules/cb");

class admin_home_product_count_handler {

  constructor() {
  }
  
  handle_get(Request,Response) {
  }
  
  handle_post(Request,Response) {
    cb.select("*").where_type("product").
    query({},function(Error,Results){
      if (Error) {
        Response.json({Product_Count:0});
        return;
      }       
      
      Response.json({Product_Count:Results.length});
    });//query
  }
}

//nodejs exports
module.exports = admin_home_product_count_handler;

//end of file