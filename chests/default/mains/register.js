
function register_new_account() {
  var Username         = e("Username").value.trim();
  var Password         = e("Password").value.trim();
  var Password_Confirm = e("Password-Confirm").value.trim();
  var Email            = e("Email").value.trim();
  var Given_Name       = e("Given-Name").value.trim();
  var Family_Name      = e("Family-Name").value.trim();
  var Full_Name        = e("Full-Name").value.trim();
           
  if (Username.length==0 || Password.length==0 || Password_Confirm.length==0 ||
  Email.length==0 || Given_Name.length==0 || Family_Name.length==0 ||
  Full_Name.length==0) {
    alert("Please enter values for all input boxes!");
    return;
  }
  
  post("/register",{
    Username:        Username,
    Password:        Password,
    Password_Confirm:Password_Confirm,
    Email:           Email,
    Given_Name:      Given_Name,
    Family_Name:     Family_Name,
    Full_Name:       Full_Name
  },
  function(Error,Data){
    if (Error)
      alert(JSON.stringify(Error));
    else
      alert(JSON.stringify(Data));
  });
}

//end of file