
function load_user_list() {
  post("/home",{},function(Error,Data){
    e("User-List").innerHTML = JSON.stringify(Data);
  });
}

//end of file