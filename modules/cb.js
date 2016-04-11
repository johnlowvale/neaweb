/**
 * Neaweb - Neat Web Framework
 * Freeware by Stinte Ltd
 * @file    Couchbase Interface Class File
 * @author  John Lowvale
 * @version 0.3    
 *
 * Version info:
 * 0.1 Preliminary code
 * 0.2 Added N1QL 'update', 'upsert', 'delete'
 * 0.3 Added methods for working on design documents
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
  static connect(Domain_Name,Bucket_Name,Callback) {
    var Cluster = new couchbase.Cluster(Domain_Name);
    
    //connect to db
    var Bucket = Cluster.openBucket(Bucket_Name,"",function(Error,Result){
      if (Error) {
        console.log("Failed to connect to Couchbase:\n"+Error+"\n");
        return;
      }
      console.log("Connected to Couchbase successfully!\n");
      Callback(Error,Result);
    });
                    
    cb.Domain_Name = Domain_Name;
    cb.Bucket_Name = Bucket_Name;
    cb.Bucket      = Bucket;
    return Bucket;  
  }    
                            
  /**
   * Get openned bucket
   */                  
  static bucket() {
    return cb.Bucket;
  }   
  
  /**
   * Couchbase ViewQuery
   */
  static view_query(Design_Name,View_Name,Options,Callback) {
    Options.connection_timeout = 60000;
    Options.inclusive_end      = true;                              
    Options.stale              = false;
  
    //build query and query
    var Query = cb.view.from(Design_Name,View_Name).custom(Options);
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
   * Short alias for view_query method
   */                                 
  static list(Design_Name,View_Name,Options,Callback) {
    cb.view_query(Design_Name,View_Name,Options,Callback);
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
   * Couchbase N1QL 'insert into...'
   */                          
  static insert() {
    cb.Sql = "insert into "+cb.Bucket_Name+" ";
    return cb;
  }                                     
  
  /**
   * Couchbase N1QL 'values...'
   */                        
  static values(Key,Value) {
    cb.Sql += "values (\""+Key+"\","+JSON.stringify(Value)+") ";
    return cb;
  }
  
  /**
   * Couchbase N1QL 'select...'
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
   * Couchbase N1QL 'and...'
   */
  static and(Condition) {
    cb.Sql += "and "+Condition+" ";
    return cb;
  }
       
  /**
   * Couchbase N1QL 'limit...'
   */
  static limit(Value) {
    cb.Sql += "limit "+Value+" ";
    return cb;
  }
  
  /**
   * Couchbase N1QL 'update...'
   */                          
  static update() {         
    cb.Sql = "update "+cb.Bucket_Name+" ";
    return cb;
  }   
   
  /**
   * Couchbase N1QL 'use keys...'
   */                          
  static use_keys(Keys) {         
    cb.Sql += "use keys \""+Keys+"\" ";
    return cb;
  }         
  
  /**
   * Couchbase N1QL 'set...'
   */                          
  static set(Assignment) {         
    cb.Sql += "set "+Assignment+" ";
    return cb;
  }                     
  
  /**
   * Couchbase N1QL 'returning...'
   */                          
  static returning(Obj_Path) {         
    cb.Sql += "returning "+Obj_Path+" ";
    return cb;
  }
      
  /**
   * Couchbase N1QL 'upsert into...'
   */                          
  static upsert() {
    cb.Sql = "upsert into "+cb.Bucket_Name+" ";
    return cb;
  }
   
  /**
   * Couchbase N1QL 'delete from...'
   */                          
  static delete() {
    cb.Sql = "delete from "+cb.Bucket_Name+" ";
    return cb;
  }
  
  /**
   * Couchbase N1QL query
   */
  static query(Params,Callback) {
    cb.sql_query(cb.Sql,Params,Callback);
    return cb;
  }        
                 
  /**
   * Find documents
   */ 
  static find(Type,Doc,Callback) {
    cb.select("*").where_type(Type);
    
    //add parameters
    for (var Key in Doc)
      cb.and(Key+"=$"+Key);
      
    //query  
    cb.query(Doc,Callback);  
  }
   
  /**
   * Find one document
   */ 
  static find_one(Type,Doc,Callback) {
    cb.select("*").where_type(Type);
    
    //add parameters
    for (var Key in Doc)
      cb.and(Key+"=$"+Key);
      
    //query  
    cb.limit(1).query(Doc,Callback);  
  }
   
  /**
   * Insert design documents
   */                       
  static insert_design_doc(Design_Name,Design_Doc,Callback) {     
    var Manager = cb.Bucket.manager();
    Manager.insertDesignDocument(Design_Name,Design_Doc,
    function(Error,Result){
      Callback(Error,Result);
    });
  }   
   
  /**
   * Get design document
   */                   
  static get_design_doc(Design_Name,Callback) {
    var Manager = cb.Bucket.manager();
    Manager.getDesignDocument(Design_Name,function(Error,Design_Doc){
      Callback(Error,Design_Doc);
    });
  }   
  
  /**
   * Get design documents 
   */                     
  static get_design_docs(Callback) {
    var Manager = cb.Bucket.manager();
    Manager.getDesignDocuments(function(Error,Design_Docs){
      Callback(Error,Design_Docs);
    });
  }                               
  
  /**
   * Upsert design document
   */                      
  static upsert_design_doc(Design_Name,Design_Doc,Callback) {
    var Manager = cb.Bucket.manager();
    Manager.upsertDesignDocument(Design_Name,Design_Doc,function(Error,Result){
      Callback(Error,Result);
    });
  }                          
  
  /**
   * Remove design document
   */                      
  static remove_design_doc(Design_Name,Callback) {
    var Manager = cb.Bucket.manager();
    Manager.removeDesignDocument(Design_Name,function(Error,Result){
      Callback(Error,Result);
    });
  }   
}//cb class

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