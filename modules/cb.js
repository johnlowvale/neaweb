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
    
    //connect to db
    var Bucket = Cluster.openBucket(Bucket_Name,"",function(Error,Result){
      if (Error) {
        console.log("Failed to connect to Couchbase:\n"+Error+"\n");
        return;
      }
      console.log("Connected to Couchbase successfully!\n");
    });
                    
    cb.Domain_Name = Domain_Name;
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
  static sql_query(Sql_String,Params,Callback) {
    var Query = cb.n1ql.fromString(Sql_String);
    cb.Bucket.query(Query,Params,Callback);
  }
      
  /**
   * Couchbase bucket counter
   */                        
  static next_id(Key,Callback) {
    var Delta   = 1;
    var Options = {initial:0};
    return cb.Bucket.counter(Key,Delta,Options,function(Error,Result){
      if (Error)
        Callback(Error,Result);
      else
        Callback(Error,Key+"-"+Result.value);
    });
  }
   
  /**
   * Couchbase N1QL 'insert into'
   */                          
  static insert() {
    cb.Sql = "insert into "+cb.Bucket_Name+" ";
    return cb;
  }                                     
  
  /**
   * Couchbase N1QL 'values'
   */                        
  static values(Key,Value) {
    cb.Sql += "values (\""+Key+"\","+JSON.stringify(Value)+") ";
    return cb;
  }
  
  /**
   * Couchbase N1QL 'select'
   */
  static select(Pattern) {
  
    //make fields
    var Tokens = Pattern.split(",");
    var Fields = "";
    for (var Index=0; Index<Tokens.length; Index++) {
      Fields += cb.Bucket_Name+"."+Tokens[Index];
      if (Index<Tokens.length-1)
        Fields += ",";
    }
    
    //do select
    cb.Sql = "select meta("+cb.Bucket_Name+").id as Id,"+Fields+" "+
    "from "+cb.Bucket_Name+" ";
    return cb;
  }
  
  /**
   * Couchbase N1QL 'where Type=...'
   */
  static where_type(Doc_Type){
    Doc_Type = Doc_Type.toUpperCase();
    cb.Sql += "where Type='"+Doc_Type+"' ";
    return cb;
  }
  
  /**
   * Couchbase N1QL 'where...'
   */
  static where(Condition) {
    cb.Sql += "where "+Condition+" ";
    return cb;
  }
   
  /**
   * Couchbase N1QL 'where ... and'
   */
  static and(Condition) {
    cb.Sql += "and "+Condition+" ";
    return cb;
  }
  
  /**
   * Couchbase N1QL query
   */
  static query(Params,Callback) {
    cb.sql_query(cb.Sql,Params,Callback);
    return cb;
  }
}

//nested classes
cb.view = couchbase.ViewQuery;
cb.n1ql = couchbase.N1qlQuery;

//other static properties
cb.Domain_Name = null;
cb.Bucket_Name = null;
cb.Bucket      = null;
cb.Sql         = null;

//nodejs export
module.exports = cb;

//end of file