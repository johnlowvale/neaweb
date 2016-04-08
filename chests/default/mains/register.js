
function register_new_account() {
  var Username         = e("Username").value;
  var Password         = e("Password").value;
  var Password_Confirm = e("Password-Confirm").value;
  var Email            = e("Email").value;
  var Given_Name       = e("Given-Name").value;
  var Family_Name      = e("Family-Name").value;
  var Full_Name        = e("Full-Name").value;
  
  post("/register",{
    Username:        Username,
    Password:        Password,
    Password_Confirm:Password_Confirm,
    Email:           Email,
    Given_Name:      Given_Name,
    Family_Name:     Family_Name,
    Full_Name:       Full_Name
  },function(Error,Data){
    if (Error)
      alert(JSON.stringify(Error));
    else
      alert(JSON.stringify(Data));
  });
}

//end of file