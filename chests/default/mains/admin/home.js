
var Product_Count = 0;

function get_product_count() {
  post("/admin/home/product-count",{},function(Error,Data){
    if (Error) {
      alert("Error "+Error);
      return;
    }         
    
    Product_Count = Data.Product_Count;
    parse("Product-Count");
  });
}

//end of file