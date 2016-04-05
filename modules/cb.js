/**
 * Neaweb - Neat Web Framework
 * Freeware by Stinte Ltd
 * @file    Couchbase Interface Class File
 * @author  John Lowvale
 * @version 0.1
 */
"use strict";

//nodejs modules
var couchbase = require("couchbase");

/**
 * Couchbase Interface Class 
 */
class cb { 
  
  /**
   * Create couchbase connection
   */
  static connect(Domain_Name,Bucket_Name) {
    var Cluster = new couchbase.Cluster(Domain_Name);
    var Bucket  = Cluster.openBucket(Bucket_Name);
    
    cb.Bucket_Name = Bucket_Name;
    cb.Bucket      = Bucket;
    return Bucket;  
  }    
   
  /**
   * Couchbase ViewQuery
   */
  static view_query(Design_Name,View_Name,Callback) {
    var Query = cb.view.from(Design_Name,View_Name);
    cb.Bucket.query(Query,Callback);
  }
  
  /**
   * Couchbase N1qlQuery
   */
  static sql_query(Sql_String,Callback) {
    var Query = cb.n1ql.fromString(Sql_String);
    cb.Bucket.query(Query,Callback);
  }
  
  /**
   * Couchbase N1QL select
   */
  static select(Pattern) {
    cb.Sql = "select "+Pattern+" ";
    return cb;
  } 
  
  /**
   * Couchbase N1QL 'from ...'
   */
  static type(Doc_Type){
    Doc_Type = Doc_Type.toUpperCase();
    cb.Sql += "from "+cb.Bucket_Name+" where Type='"+Doc_Type+"' ";
    return cb;
  }
  
  /**
   * Couchbase N1QL 'where .. and'
   */
  static where(Condition) {
    cb.Sql += "and "+Condition+" ";
    return cb;
  }
  
  /**
   * Couchbase N1QL query
   */
  static query(Callback) {
    cb.sql_query(cb.Sql,Callback);
    return cb;
  }
}

//nested classes
cb.view = couchbase.ViewQuery;
cb.n1ql = couchbase.N1qlQuery;

//other static properties
cb.Bucket_Name = null;
cb.Bucket      = null;
cb.Sql         = null;

//nodejs export
module.exports = cb;

//end of file