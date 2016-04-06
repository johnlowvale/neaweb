
"use strict";

class admin_home_product_count_handler {

  constructor() {
  }
  
  handle_get(Request,Response) {
  }
  
  handle_post(Request,Response) {
    Response.json({Product_Count:999});
  }
}

//nodejs exports
module.exports = admin_home_product_count_handler;

//end of file