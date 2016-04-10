/**
 * Neaweb - Neat Web Framework
 * Freeware by Stinte Ltd
 * @file    Server module
 * @version 1.1
 * @author  John Lowvale
 */         
"use strict"; 
 
//nodejs modules
var fs = require("fs");

//library modules
var body_parser   = require("body-parser");
var cookie_parser = require("cookie-parser"); 
var express       = require("express");
var js_beautify   = require("js-beautify");
var jsdom         = require("jsdom");

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
    server.Handlers         = {};    
    server.Htmls            = {};  
    server.Locales          = {};
    
    //singleton
    server.Self = this;
  }   
                   
  /**
   * Count object properties
   */                       
  count(Variable) {
    var Count = 0;
    for (var Key in Variable)
      Count++;
    return Count;
  }   
         
  /**
   * Try making a directory if not existing
   */                                      
  make_dir(Path) {
    try {
      fs.mkdirSync(Path);
    }
    catch (Error) {
      //
    }
  }   
  
  /**
   * Handle all GET requests  
   * Static files requested but not found may lead to this method too,
   * this method won't handle files, only routes.
   * The response is a scroll template.
   */                       
  handle_get(Request,Response) {
    console.log(`${Request.ip} ${Request.method} ${Request.path}`);    
         
    //default scroll for root url       
    var Path = Request.path;           
    if (Path=="/")
      Path = "/"+server.Default_Scroll;
    if (Path.charAt(Path.length-1)=="/")
      Path = Path.substr(0,Path.length-1);
                                       
    //check locale in cookies
    var Locale_Name = Request.cookies.locale;
    if (Locale_Name==null)
      Locale_Name = server.Default_Locale;      
      
    //get html
    var Html = server.Htmls[Locale_Name][Path];
    if (Html!=null)
      Response.send(Html);
    else {         
      if (server.Htmls[Locale_Name]["/not-found"])    
        Response.send(`
          <script> 
          top.location = "/not-found";
          </script>
        `);
      else
        Response.send("/not-found"); 
    }                        
  }   
   
  /**
   * Handle all POST requests      
   * The response is usually JSON data
   */                       
  handle_post(Request,Response) {      
    console.log(`${Request.ip} ${Request.method} ${Request.path}`);    
    
    //default scroll for root url       
    var Path = Request.path;           
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
   * Make temporary template for a scroll with specific main section
   */                                                               
  make_temp_template(Url_Path,Locale_Name) {
    var Cwd           = process.cwd();
    var Template_File = Cwd+"/chests/"+server.Default_Chest+"/templates/"+
                        server.Default_Template+".html"; 
    var Template_Html = fs.readFileSync(Template_File,"utf8");
    var Main_Path     = "/mains"+Url_Path+".html";
    
    //eval
    Template_Html = eval("`"+Template_Html+"`");
    
    //make temporary template file  
    var Temp_Name = Url_Path.replace(/\//g,"-").substr(1);       
    var Temp_Dir  = Cwd+"/chests/"+server.Default_Chest+"/temp/"+Locale_Name;
    var Temp_File = Temp_Dir+"/"+Temp_Name+".html";
    this.make_dir(Temp_Dir);
    fs.writeFileSync(Temp_File,Template_Html,"utf8");
    
    //return sub-path from chest root
    return "/temp/"+Locale_Name+"/"+Temp_Name+".html";                            
  }   
  
  /**
   * Load request handlers    
   * Full_Path is directory path
   */                     
  load_handlers(Full_Path) {
  
    //readdir
    var Files = fs.readdirSync(Full_Path);
    for (var Index in Files) {
      var File_Name = Files[Index];
             
      //stat
      var File_Path = Full_Path+"/"+File_Name;           
      var Stats     = fs.statSync(File_Path);      
      
      //process .js files
      if (Stats.isFile() && File_Name.match(/.*\.js/)) {
        var Cwd    = process.cwd();
        var Prefix = Cwd+"/chests/"+server.Default_Chest+"/handlers";
        var Key    = File_Path.replace(Prefix,"").replace(".js","");
        server.Handlers[Key] = require(File_Path);   
                    
        //logs    
        console.log("");
        console.log(File_Path.replace(/\\/g,"/"));
        console.log(`as server.Handlers["${Key}"]`);
      }
      else
      if (Stats.isDirectory())
        this.load_handlers(File_Path);
    }
  }   
         
  /**
   * Parse a DOM node
   */                
  parse_node(Node,Locale_Name) {
  
    //element node
    if (Node.nodeType==server.JSDOM_ELEMENT_NODE) {
      if (Node.hasAttribute("server-src")) {       
        var Sub_Path = Node.getAttribute("server-src");
        Node.innerHTML = this.pack_html(Sub_Path,false,Locale_Name);        
      }                                              
    }
                  
    //text node
    if (Node.nodeType==server.JSDOM_TEXT_NODE) {
      var Text = Node.nodeValue; 
      while (Text.search(/%\{.+\}/)>=0) {
        var Var = Text.match(/%\{.+\}/).toString();
        var Key = Var.substr(2,Var.length-3).trim();
        Text = Text.replace(Var,server.Locales[Locale_Name][Key]);
      }
      Node.nodeValue = Text;
    }
    
    //loop thru' child nodes
    for (var Index=0; Index<Node.childNodes.length; Index++)
      Node.childNodes[Index] = 
      this.parse_node(Node.childNodes[Index],Locale_Name);      
    
    //pass back parse node
    return Node;    
  }
  
  /**  
   * Pack an html file with its included html using 'server-src' attribute
   */                                   
  pack_html(Sub_Path,Full_Doc,Locale_Name) {
    var Cwd       = process.cwd();
    var Full_Path = Cwd+"/chests/"+server.Default_Chest+Sub_Path;    
    
    //check file
    try {
      var Stats = fs.statSync(Full_Path);
      if (!Stats.isFile())
        return "";                             
    }
    catch (Error) {
      return "";
    }             
    
    //get document
    var Html = fs.readFileSync(Full_Path,"utf8");
    var Doc  = jsdom.jsdom(Html);
    
    //parse nodes
    for (var Index=0; Index<Doc.childNodes.length; Index++)
      Doc.childNodes[Index] = 
      this.parse_node(Doc.childNodes[Index],Locale_Name);    
      
    //to string               
    if (Full_Doc)
      return jsdom.serializeDocument(Doc);      
    else {                
      var Head = Doc.documentElement.childNodes[0];
      var Body = Doc.body;                         
      return Head.innerHTML+Body.innerHTML;
    }  
  }   
    
  /**
   * Pack all main HTMLs
   * Full_Path is directory path
   */                   
  pack_htmls(Full_Path,Locale_Name) {
  
    //readdir
    var Files = fs.readdirSync(Full_Path);
    for (var Index in Files) {
      var File_Name = Files[Index];
             
      //stat
      var File_Path = Full_Path+"/"+File_Name;           
      var Stats     = fs.statSync(File_Path);
      
      //process .html files
      if (Stats.isFile() && File_Name.match(/.*\.html/)) {
        var Cwd      = process.cwd();
        var Prefix   = Cwd+"/chests/"+server.Default_Chest+"/mains";
        var Key      = File_Path.replace(Prefix,"").replace(".html","");
        var Sub_Path = this.make_temp_template(Key,Locale_Name);    
        
        //pack html files into one
        if (server.Htmls[Locale_Name]==null)
          server.Htmls[Locale_Name] = {};
        var Packed_Html = this.pack_html(Sub_Path,true,Locale_Name);
        
        //pretty print by jsbeautifier.org
        Packed_Html = js_beautify.html(Packed_Html,{     
          indent_size:     2, //OK
          wrap_line_length:80 //not working!
        });
        server.Htmls[Locale_Name][Key] = Packed_Html; 
        
        //save to file                                             
        var Packed_Dir  = Cwd+"/chests/"+server.Default_Chest+"/packeds/"+
                          Locale_Name;
        var Packed_File = Key.replace(/\//g,"-").substr(1)+".html";
        this.make_dir(Packed_Dir);
        fs.writeFileSync(Packed_Dir+"/"+Packed_File,Packed_Html,"utf8");
                    
        //logs    
        console.log("");
        console.log(File_Path.replace(/\\/g,"/"));
        console.log(`into server.Htmls["${Locale_Name}"]["${Key}"]`);
      }
      else
      if (Stats.isDirectory())
        this.pack_htmls(File_Path,Locale_Name);
    }
  }
                           
  /**
   * Get locales
   */               
  load_locales() {           
    var Cwd   = process.cwd(); 
    var Chest = server.Default_Chest;
    var Path  = Cwd+"/chests/"+Chest+"/locales"; 
    var Files = fs.readdirSync(Path);
    
    //loop thru' files to get locale files
    for (var Index=0; Index<Files.length; Index++) {
      if (Files[Index].match(/.*\.json/)) {       
        var File = Files[Index];        
        var Json = fs.readFileSync(Path+"/"+File,"utf8");
        var Obj  = {};        
        
        //parse locale json
        console.log(`\nParsing locale ${File}...`);
        try {
          Obj = JSON.parse(Json);          
        }
        catch (Error) {
          console.log("Error: "+Error);
          continue;
        }     
                                
        //create a locale
        var Locale_Name = File.replace(/\.json/g,"");
        if (server.Locales[Locale_Name]==null)
          server.Locales[Locale_Name] = {};
          
        //push phrases into server.Locales
        for (var Key in Obj) {
          var Value = Obj[Key];
          server.Locales[Locale_Name][Key] = Value;
        }                       
        
        console.log("Parsed.");
      }//if                                         
    }//for      
  }//load locales
  
  /**
   * Extract some constants from 'jsdom' module
   */           
  extract_constants() {
    var Doc    = jsdom.jsdom("blank");
    var Window = Doc.defaultView;
                              
    server.JSDOM_COMMENT_NODE = Window.Node.COMMENT_NODE;
    server.JSDOM_ELEMENT_NODE = Window.Node.ELEMENT_NODE;
    server.JSDOM_TEXT_NODE    = Window.Node.TEXT_NODE;    
  }
  
  /**
   * Start server
   */            
  start() {
    this.extract_constants();
     
    //expressjs instance
    var Server         = express();
    var Server_Name    = server.Server_Name;
    var Server_Version = server.Server_Version;
    var Server_Port    = server.Server_Port;
    var Default_Chest  = server.Default_Chest;
          
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
                                              
    //body parser & cookie parser
    Server.use(body_parser.json());
    Server.use(cookie_parser());
    
    //catch all gets & posts
    Server.get("*",this.handle_get);      
    Server.post("*",this.handle_post);
          
    //load locales     
    console.log("Loading locales...");
    this.load_locales();
    console.log("\nLoaded "+this.count(server.Locales)+" locales\n");
       
    //load handler classes     
    var Cwd = process.cwd();                                   
    var Handlers_Dir = Cwd+"/chests/"+Default_Chest+"/handlers";   
    console.log("Loading handlers...");
    this.load_handlers(Handlers_Dir);
    console.log("\nLoaded "+this.count(server.Handlers)+" handlers\n");
   
    //generate compiled htmls    
    console.log("Packing HTMLs...");                      
    var Mains_Dir = Cwd+"/chests/"+Default_Chest+"/mains";       
    for (var Locale_Name in server.Locales) 
      this.pack_htmls(Mains_Dir,Locale_Name);
    console.log("\nPacked HTMLs for "+this.count(server.Htmls)+" locales\n");
            
    //db connection
    cb.connect(server.Database_Host,server.Database_Name);
    
    //start server
    Server.listen(Server_Port,function(){
      console.log(Server_Name+" "+Server_Version+" started at port "+
      Server_Port+"...\n");
    });
  }//start
}//class

//nodejs export
module.exports = server;

//end of file