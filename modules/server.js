/**
 * Neaweb - Neat Web Framework
 * Freeware by Stinte Ltd
 * @file    Server module
 * @version 0.1
 * @author  John Lowvale
 */         
"use strict"; 
 
//nodejs libraries
var body_parser = require("body-parser");
var express     = require("express");
var fs          = require("fs");

//project modules
var cb = require("./cb");

/**
 * Main server class
 */
class server { 

  /**
   * Constructor
   */           
  constructor(Server_Name,Server_Version,Server_Port,Database_Host,
  Database_Name,Default_Chest,Default_Scroll,Default_Template,
  Default_Locale) {
    server.Server_Name      = Server_Name;
    server.Server_Version   = Server_Version;
    server.Server_Port      = Server_Port;
    server.Database_Host    = Database_Host;
    server.Database_Name    = Database_Name; 
    server.Default_Chest    = Default_Chest;
    server.Default_Scroll   = Default_Scroll;      
    server.Default_Template = Default_Template;
    server.Default_Locale   = Default_Locale;       
    server.Handlers         = [];
                               
    //db connection
    cb.connect(Database_Host,Database_Name);
    
    //singleton
    server.Self = this;
  }  
  
  /**
   * Handle all GET requests  
   * Static files requested but not found may lead to this method too,
   * this method won't handle files, only routes.
   */                       
  handle_get(Request,Response) {
    var Path = Request.path;
         
    //check if a dot exists in path
    if (Path.indexOf(".")>=0) {
      Response.send("");
      return;
    }
    
    //read template        
    var Template = fs.readFile(
      "chests/"+server.Default_Chest+"/templates/"+
      server.Default_Template+".html",
      "utf8",
      function(Error,Data){  
        if (Error) { 
          console.log(Error);
          Response.send("");
          return;
        }                   
                        
        //main section url
        if (Path=="/")
          Path = "/"+server.Default_Scroll;
        if (Path.charAt(Path.length-1)=="/")
          Path = Path.substr(0,Path.length-1);  
        var Main_Section_Url = "/mains"+Path+".html";
               
        //check if main section exists
        fs.stat("chests/"+server.Default_Chest+Main_Section_Url,
        function(Error,Stats){
          if (Error!=null || !Stats.isFile())
            Main_Section_Url = "/templates/blank.html";
                                      
          //locale name
          var Locale_Name = server.Default_Locale;  
            
          //parse template
          Data = eval("`"+Data+"`");
          Response.send(Data);    
        });
      }
    );//read template       
  }   
   
  /**
   * Handle all POST requests
   */                       
  handle_post(Request,Response) {
    var Path = Request.path;
    
    //default scroll for root url                  
    if (Path=="/")
      Path = "/"+server.Default_Scroll;
    if (Path.charAt(Path.length-1)=="/")
      Path = Path.substr(0,Path.length-1);
      
    //get handler
    var Handler_Class = server.Handlers[Path];
    if (Handler_Class!=null)
      var Handler_Instance = new Handler_Class();
    else {
      Response.json({error:"NO-HANDLER-FOUND"});
      return;
    }
    
    //call handler                            
    Handler_Instance.handle_post(Request,Response);
  }
                    
  /**
   * Load request handlers
   */                     
  load_handlers(Path) {
  
    //readdir
    var Files = fs.readdirSync(Path);
    for (var Index in Files) {
      var File_Name = Files[Index];
             
      //stat
      var File_Path = Path+"/"+File_Name;           
      var Stats     = fs.statSync(File_Path);
      if (Stats.isFile()) {
        var Cwd    = process.cwd();
        var Prefix = Cwd+"/chests/"+server.Default_Chest+"/handlers";
        var Key    = File_Path.replace(Prefix,"").replace(".js","");
        server.Handlers[Key] = require(File_Path);
      }
      else
      if (Stats.isDirectory())
        this.load_handlers(File_Path);
    }
  }   
  
  /**
   * Start server
   */            
  start() {
     
    //expressjs instance
    var Server         = express();
    var Server_Name    = server.Server_Name;
    var Server_Version = server.Server_Version;
    var Server_Port    = server.Server_Port;
    var Default_Chest  = server.Default_Chest;
    
    //load handler classes     
    var Cwd  = process.cwd();                                   
    var Path = Cwd+"/chests/"+Default_Chest+"/handlers"; 
    this.load_handlers(Path);
         
    //body parser
    Server.use(body_parser.json());
          
    //static directories
    Server.use("/libs",  
    express.static("chests/"+Default_Chest+"/libs")); 
    Server.use("/locales",  
    express.static("chests/"+Default_Chest+"/locales"));
    Server.use("/templates",
    express.static("chests/"+Default_Chest+"/templates"));     
    Server.use("/mains",
    express.static("chests/"+Default_Chest+"/mains"));        
    Server.use("/sections",
    express.static("chests/"+Default_Chest+"/sections"));
    Server.use("/images",
    express.static("chests/"+Default_Chest+"/images"));
     
    //catch all gets & posts
    Server.get("*",this.handle_get);      
    Server.post("*",this.handle_post);
    
    //start server
    Server.listen(Server_Port,function(){
      console.log(Server_Name+" "+Server_Version+" started at port "+
      Server_Port+"...\n");
    });
  }
}

//nodejs export
module.exports = server;

//end of file