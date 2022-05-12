
// Changing Features Page based on screen width 

if ($(window).width() < 985) {
    document.getElementById("big-screen").innerHTML = " ";
 }
 else {    
    document.getElementById("small-screen").innerHTML = " ";
 }

//  Password Visibility

function myFunction() {
  var x = document.getElementById("inputPassword");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}
