
// Changing Features Page based on screen width 
alert($(window).width())

if ($(window).width() < 1090) {
    document.getElementById("big-screen").innerHTML = " ";
 }
 else {
    
    document.getElementById("small-screen").innerHTML = " ";
 }


