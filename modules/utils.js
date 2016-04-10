
"use strict";

//nodejs modules
var crypto = require("crypto"); 

class utils {

  constructor() {
  }
  
  static sha1(Text) {
    var Sha1 = crypto.createHash("sha1");
    Sha1.update(Text);
    return Sha1.digest("hex");    
  }
}

//nodejs exports
module.exports = utils;

//end of file