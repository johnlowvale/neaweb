
"use strict";

//project modules
var security = require(process.cwd()+"/modules/security");

class admin_home_handler {

  constructor() {
  }
  
  handle_get(Request,Response) {   
    return security.PASSED;
  }
  
  handle_post(Request,Response) {
  }
}

//nodejs exports
module.exports = admin_home_handler;

//end of file