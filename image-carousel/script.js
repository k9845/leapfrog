


var Index = 1;
var myTimer;
show(Index);



//this works for next and pevious
function plus(n) {
    clearInterval(myTimer);
    if (n < 0){
      show(Index -= 1);
    } else {
     show(Index += 1); 
    }
    if (n === -1){
      myTimer = setInterval(function(){
          plus(n + 2)}, 4000);
    } else {
      myTimer = setInterval(function(){
          plus(n + 1)}, 4000);
    }
    
}


//shows the current in the dots
function current(n) {
    clearInterval(myTimer);
  myTimer = setInterval(function(){
      plus(n + 1)}, 4000);
  show(Index = n);
}


//function the main working
function show(n) {
  var i;
  var image = document.getElementsByTagName("img");
  var dots = document.getElementsByClassName("dot");
  if (n > image.length) {
      Index = 1
    }    
  if (n < 1) {
      Index = image.length
    }
  for (i = 0; i < image.length; i++) {
      image[i].style.display = "none";  
  }
  image[Index-1].style.display = "block"; 
 
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
   
  dots[Index-1].className += " active";
 
}

//summing up everything
window.addEventListener("load",function() {
    show(Index);
    myTimer = setInterval(function(){plus(1)}, 4000);
})