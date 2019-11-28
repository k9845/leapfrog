var ref2;
var direction = -1;

var sliderUl = document.getElementById('slider-ul');
var dots = document.getElementsByTagName('span');


var buttonPrevious = document.getElementsByClassName('left-arrow')[0];
var buttonNext = document.getElementsByClassName('right-arrow')[0];

var imgWidth = 800;
var noOfImages = imageCounter();
var maxMargin = noOfImages * imgWidth - imgWidth;
var currentMargin = 0;
var index = 0;
var newCurrentMargin = 0;


function imageCounter(){
  var imgs = document.getElementsByTagName('li'); 
  return imgs.length;
}


function previousImage(){
  index--;
  if(index<0) {index = noOfImages-1;}
  else if(index>noOfImages-1) {index = 0;}
  gotoSlide(index);
}

function nextImage(){
  index++;
  if(index<0) {index = noOfImages-1;}
  else if(index>noOfImages-1) {index = 0;}
  gotoSlide(index);
}

buttonPrevious.onclick = function(){
  previousImage();
}

buttonNext.onclick = function(){
  nextImage();
}

dots[0].onclick = function(){gotoSlide(0);}
dots[1].onclick = function(){gotoSlide(1);}
dots[2].onclick = function(){gotoSlide(2);}
dots[3].onclick = function(){gotoSlide(3);}



function gotoSlide(i){
  sliderUl.style.marginLeft = -(i * imgWidth) + 'px';
}


function transition(){
  newCurrentMargin += direction * 10;
  sliderUl.style.marginLeft = newCurrentMargin + 'px';

  if(newCurrentMargin > 0){
    direction = -1;
    //console.log(direction);
  }
  else if(newCurrentMargin < -maxMargin)
  {
    direction = 1;
    //console.log(direction);
  }

  if(newCurrentMargin % imgWidth == 0){
    index++;
    dots[index].style.backgroundColor = "red";
    if(index<0) {index = noOfImages-1;}
    else if(index>noOfImages-1) {index = 0;}
    clearInterval(ref2);
    setTimeout(init, 4000);
  }

}


function init(){
  ref2 = setInterval(transition, 10);
}


init();