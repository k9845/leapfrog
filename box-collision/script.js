(function(){
    function Box(parentElement,x,y,height,width,dx,dy,force,time,mass){
        this.x = x ||12;
        this.y = y || 12;
        this.width = width || 20;
        this.height = height || 20;
        this.dx = dx || 1.5;
        this.dy = dy || 1.5;
        this.force = force ;
        this.mass = mass ||3;
        this.time = time || 4;
        this.parentElement= parentElement;
        this.element = null;
        var that = this;

        this.draw = function(){
            var box = document.createElement('div');
            box.style.width = this.width + 'px';
            box.style.height = this.height + 'px';
            box.classList.add('box');
            this.parentElement.appendChild(box);
            this.element = box;
            // this.draw();
            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';

            this.element.onclick = function(){
                that.element.style.display = 'none';
            }
           return this;

        }


        this.setPosition = function(x,y){
            this.x = x;
            this.y = y;
        }

        this.move = function(dx,dy){
            this.x += this.dx;
            this.y +=this.dy;
             this.element.style.left = this.x + 'px';
             this.element.style.top = this.y + 'px';
             if((this.x+this.width>=800) ||this.x<=0 || (this.y+this.height>=500) ||this.y<=0){
                this.dx =-this.dx;
                this.dy = -this.dy;
                this.force = ((this.dx+this.dy)/this.time) * this.mass;
                console.log('force',this.force);
             }
             
     }
     this.checkCollision = function(boxes) {
         for(var i = 0; i< boxes.length;i++){

                if(!(this == boxes[i])){

                
                    if ((this.x < boxes[i].x + boxes[i].width) &&
                     ( this.x + this.width > boxes[i].x )&&
                        (this.y < boxes[i].y + boxes[i].height )&&
                        (this.y + this.height > boxes[i].y) ){
                            this.dx = -this.dx;
                            this.dy = -this.dy;
                            // randx = getrandomnumber(0,MAX_WIDTH-width);
                            // randy= getrandomnumber(0,MIN_HEIGHT-height);
                            this.force = ((this.dx+this.dy)/this.time) * this.mass;
                        
                        }
        }else{
            //console.log('nope collide');
         }
        }

    }   
}
        
    function getrandomnumber(min,max){
        return Math.random() * (max - min) + min;

    }

    function Game(parentElement,boxcount){
        this.parentElement = parentElement;
        this.boxcount = boxcount || 15;
        var MAX_WIDTH = 800;
        var MIN_HEIGHT = 500;
        var boxes = [];

        this.startGame = function(){
            for(var i=0; i<this.boxcount; i++){
                var randx = getrandomnumber(0,MAX_WIDTH-width);
                var randy= getrandomnumber(0,MIN_HEIGHT-height);
                var height = 40;
                var width = 40;
                var mass  = 3;
                var time = 4;
                var force ;

                // for(var i=0;i<boxes.length;i++){
                //     if((boxes[i].x<randx+width) ||(boxes[i].x+width>randx) ||
                //     (randy+width>box[i].y) || (boxes[i].y+width<randy)){
                //          randx = getrandomnumber(0,MAX_WIDTH-width);
                //          randy= getrandomnumber(0,MIN_HEIGHT-height);
                //     }
                // }
                
                

                // (a.x + a.width > b.x && a.x + a.width <= b.x + b.width) || (b.x + b.width > a.x && b.x + b.width <= a.x + a.width)) && 
                // ((a.y + a.height > b.y && a.y + a.height <= b.y + b.height) || (b.y + b.height > a.y && b.y + b.height <= a.y + a.height)
                
                var dx = getrandomnumber(-5,5);
                var dy = getrandomnumber(-5,5);
                var box = new Box(this.parentElement,randx,randy,height,width,dx,dy,mass,time,force).draw();
                    
                
               
                boxes.push(box);

                }
                setInterval(this.moveBoxes.bind(this),100);
            }
            this.moveBoxes = function(){
                for(var i =0; i<this.boxcount;i++){
                    boxes[i].move();
                    boxes[i].checkCollision(boxes);
                }
            }
        }





    
var parentElement = document.getElementById('container');

// new Box(parentElement,2,3,15,15,3,4).draw();
// new Box(parentElement,122,13,15,15,3,4).draw();
new Game(parentElement,20).startGame();

})();