/**
 * Neaweb - Neat Web Framework
 * Freeware by Stinte Ltd
 * @file    Server booting file
 * @version 1.7 (following server.js version)
 * @author  John Lowvale 
 *
 * Run:
 * node index.js      
 *
 * Notes:
 * Current NodeJS version for this project is NodeJS 4.x as
 * - NodeJS 0.12.x is too old
 * - IoJS   3.x is old too
 * - NodeJS 4.x has Couchbase binary library
 * - NodeJS 5.x hasn't come with Couchbase binary library yet (April 2016)
 * Beside Couchbase, ExpressJS and other popular NodeJS modules
 * jsdom, js-beautify are also used.
 * Client side of this project comes with Quickt (AngularJS-like)
 * which is a very light-weight library for browser JavaScript.  
 */
"use strict";

//project modules
var server = require("./modules/server");

//constants
var SERVER_NAME      = "Neaweb";
var SERVER_VERSION   = "1.7";
var SERVER_PORT      =  80;
var DATABASE_HOST    = "localhost";
var DATABASE_NAME    = "neaweb";
var DEFAULT_CHEST    = "default";
var DEFAULT_SCROLL   = "home";
var DEFAULT_TEMPLATE = "simple";
var DEFAULT_LOCALE   = "locale-uk";

//create server
var Server = new server(
  SERVER_NAME,SERVER_VERSION,SERVER_PORT,DATABASE_HOST,DATABASE_NAME,
  DEFAULT_CHEST,DEFAULT_SCROLL,DEFAULT_TEMPLATE,DEFAULT_LOCALE
);
Server.start();

//end of file