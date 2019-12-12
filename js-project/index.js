const FPS = 30; //frames in second
const SHOOTER_SIZE = 30; ///size in pixel
const TURN_SPEED = 360; //degree in second
const SHOOTER_THRUST = 5; //ACCELERATION
const FRICTION = 0.6; //friction coefficient
const OBS_NUM = 3; //starting no
const OBS_SPEED = 20;//staring speed of obstacles in pixel per second
const OBS_SIZE = 100; //staring size in pixel
const OBS_VERT  = 10 //average no of vetices in obsracles
const OBS_JNG = 0.7 //shape management
const SHOW_BOUNDING = false; //show collission detection
const SHOT_EXPLODE_DUR = 0.3 //duration of shooter explosion
const SHOT_INV_DUR = 3;// duration of shooter invsibility
const SHOT_BLINK_DUR = 0.1 //duration of shooter blink
const GUN_MAX = 10 //max no of guns per second
const GUN_SPEED = 500 //speed in pixel per second
const GUN_DIST = 0.5//maximum distance gun can travel



var canv = document.getElementById('gameCanvas');
var ctx = canv.getContext('2d');

var shooter = newShooter();

var obstacles = [];
createObstacles();

//event handlers

document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);

//set up the game loop;
setInterval(update,1000/FPS);

function createObstacles(){
    obstacles = [];
    var x,y;
    for(var i=0;i<OBS_NUM;i++){
        do{
            x = Math.floor(Math.random()*canv.width);
            y = Math.floor(Math.random()*canv.height);
            

        }while(distBetweenPoints(shooter.x,shooter.y,x,y)< OBS_SIZE*2 + shooter.r);
        obstacles.push(newObstacles(x,y,Math.ceil(OBS_SIZE /2)));
    }
}
function destroyObstacles(index){
    var x = obstacles[index].x;
    var y = obstacles[index].y;
    var r = obstacles[index].r;

    //split the obstacles
    if(r == Math.ceil(OBS_SIZE /2)){
        obstacles.push(newObstacles(x,y,Math.ceil(OBS_SIZE /4)));
        obstacles.push(newObstacles(x,y,Math.ceil(OBS_SIZE /4)));
    
    }else if(r == Math.ceil(OBS_SIZE /4)){
        obstacles.push(newObstacles(x,y,Math.ceil(OBS_SIZE /8)));
        obstacles.push(newObstacles(x,y,Math.ceil(OBS_SIZE /8)));
    }
    //destroy obstacles
    obstacles.splice(index,1);
}
function distBetweenPoints(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}
function explodeShooter(){
   shooter.explodeTime = Math.ceil(SHOT_EXPLODE_DUR *FPS)
}

function keyDown(ev){
    switch(ev.keyCode){
        case 37://left arrow(rotate left)
            shooter.rot = TURN_SPEED /180 *Math.PI /FPS;
            break;
        case 32://space bar for shoot
           shootgun();
            break;
         case 38://up arrow(thrust)
            shooter.thrusting = true;
            break;  
        case 39://right arrow(rotate right)
        shooter.rot = -TURN_SPEED /180 *Math.PI /FPS;
            break;  
    }
}
function keyUp(ev){
    switch(ev.keyCode){
        case 32://space bar for shoot
           shooter.canShoot = true;
            break;
        case 37://left arrow(stop rotate left)
            shooter.rot = 0;
            break;
         case 38://up arrow(thrust)
         shooter.thrusting = false;
            break;  
        case 39://right arrow(stop rotate right)
        shooter.rot = 0;
            break;  
    }
}
function newObstacles(x,y,r){
    var obstacles ={
        x:x,
        y:y,
        xv : Math.random() * OBS_SPEED /FPS * (Math.random() <0.5 ? 1 : -1),
        yv : Math.random() * OBS_SPEED /FPS * (Math.random() <0.5 ? 1 : -1),
        r:r,
        a:Math.random()*Math.PI*2,
        vert:Math.floor(Math.random()* (OBS_VERT +1)*OBS_VERT /2),
        offs:[]
    };

    //create the vertex offset array
    for(var i =0; i < obstacles.vert;i++){
        obstacles.offs.push(Math.random()* OBS_JNG *2 +1 -OBS_JNG);
    }

    return obstacles;
}
function newShooter(){
    return {
        x:canv.width/2,
        y:canv.height/2,
        r:SHOOTER_SIZE/2,
         a:90 /180 * Math.PI, //in radina
         blinkNum:Math.ceil(SHOT_INV_DUR/SHOT_BLINK_DUR),
         blinkTime:Math.ceil(SHOT_BLINK_DUR *FPS),
        canShoot :true,
        gun:[],
         explodeTime:0,
         rot:0,
         thrusting:false,
        thrust:{
            x:0,
            y:0
        }
    
    }

}
function shootgun(){
    //create gun object
    if(shooter.canShoot && shooter.gun.length < GUN_MAX){
        shooter.gun.push({
            x: shooter.x + 4/3*shooter.r *Math.cos(shooter.a),
            y:shooter.y - 4/3*shooter.r *Math.sin(shooter.a),
            xv:GUN_SPEED *Math.cos(shooter.a)/FPS,
            yv:-GUN_SPEED * Math.sin(shooter.a)/FPS,
            dist:0
        });
    }
    //prevent further shooting
    shooter.canShoot = false;
}
function update(){
    var blinkOn = shooter.blinkNum %2 == 0;

    var exploding = shooter.explodeTime >0;
    //draw background
    ctx.fillStyle  = 'black';
    ctx.fillRect(0,0,canv.width,canv.height);
    
     

    //thrusting
    if(shooter.thrusting){
        shooter.thrust.x += SHOOTER_THRUST * Math.cos(shooter.a)/FPS;
        shooter.thrust.y -= SHOOTER_THRUST * Math.sin(shooter.a)/FPS;
      //draw thrust
      if(!exploding && blinkOn){
        ctx.fillStyle = 'yellow'
      ctx.strokeStyle = 'purple';
      ctx.lineWidth = SHOOTER_SIZE /10;
      ctx.beginPath();
      ctx.moveTo(
        shooter.x - shooter.r *(2/3*Math.cos(shooter.a) + 0.4*Math.sin(shooter.a)),
        shooter.y + shooter.r *(2/3*Math.sin(shooter.a)- 0.4*Math.cos(shooter.a))
      );
      ctx.lineTo(
         
          shooter.x - 6/3*shooter.r *Math.cos(shooter.a),
          shooter.y + 6/3*shooter.r *Math.sin(shooter.a),
          );
      ctx.lineTo(
          shooter.x - shooter.r *(2/3*Math.cos(shooter.a) - 0.4*Math.sin(shooter.a)),
          shooter.y + shooter.r *(2/3*Math.sin(shooter.a)+ 0.4*Math.cos(shooter.a)),
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      }
      
    }else{
        shooter.thrust.x -= FRICTION * shooter.thrust.x /FPS;
        shooter.thrust.y -= FRICTION * shooter.thrust.y /FPS;
    }

    //draw shooter
    if(!exploding){
        if(blinkOn){
            ctx.strokeStyle = 'red';
        ctx.lineWidth = SHOOTER_SIZE /20;
        ctx.beginPath();
    ctx.moveTo(
        shooter.x + 4/3*shooter.r *Math.cos(shooter.a),
        shooter.y - 4/3*shooter.r *Math.sin(shooter.a),
    );
    ctx.lineTo(
        shooter.x - shooter.r *(2/3*Math.cos(shooter.a) + Math.sin(shooter.a)),
        shooter.y + shooter.r *(2/3*Math.sin(shooter.a)- Math.cos(shooter.a)),
    );
   
    ctx.lineTo(
        shooter.x - shooter.r *(2/3*Math.cos(shooter.a) - Math.sin(shooter.a)),
        shooter.y + shooter.r *(2/3*Math.sin(shooter.a)+ Math.cos(shooter.a)),
    );
    ctx.closePath();
    
   
    ctx.stroke();
        }
        //handle blinking
        if(shooter.blinkNum >0){
            //reduce blink duration
            shooter.blinkTime --;
            //reduce the blink num
            if(shooter.blinkTime ==0){
                shooter.blinkTime = Math.ceil(SHOT_BLINK_DUR *FPS);
                shooter.blinkNum --;
            }
        }

    }else{
        //draw explosion
        ctx.fillStyle = 'darkred';
        ctx.beginPath();
        ctx.arc(shooter.x,shooter.y,shooter.r*1.7,0,Math.PI *2,false);
        ctx.fill();
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(shooter.x,shooter.y,shooter.r*1.1,0,Math.PI *2,false);
        ctx.fill();
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(shooter.x,shooter.y,shooter.r*0.8,0,Math.PI *2,false);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(shooter.x,shooter.y,shooter.r*0.5,0,Math.PI *2,false);
        ctx.fill();

    }
    
        if(SHOW_BOUNDING){
            ctx.strokeStyle = 'blue';
            
            ctx.beginPath();
            ctx.arc(shooter.x,shooter.y,shooter.r,0,Math.PI *2,false);
            ctx.stroke();
        }


    //draw Obstacles
       
        var x,y,r,a,vert,offs;
        for(var i =0;i<obstacles.length;i++){
            ctx.strokeStyle = 'green';
            ctx.lineWidth =  SHOOTER_SIZE /20;
            x = obstacles[i].x;
            y = obstacles[i].y;
            r = obstacles[i].r;
            a = obstacles[i].a;
            vert = obstacles[i].vert;
            offs = obstacles[i].offs
           
            //draw a path
            ctx.beginPath();
            ctx.moveTo(
                x + r*offs[0] *Math.cos(a),
                y + r*offs[0] *Math.sin(a)
            );
            //draw the different shpaes
                for(var j=1;j<vert;j++){
                    ctx.lineTo(
                        x+r*offs[j]  * Math.cos(a+j * Math.PI *2 /vert),
                        y+r*offs[j] * Math.sin(a+j *Math.PI *2 /vert),
                    );
                }
                ctx.closePath();
                ctx.stroke();
                if(SHOW_BOUNDING){
                    ctx.strokeStyle = 'red';
                    
                    ctx.beginPath();
                    ctx.arc(x,y,r,0,Math.PI *2,false);
                    ctx.stroke();
                }

           
        }
        //draw gun
        for(var i = 0;i<shooter.gun.length;i++ ){
            ctx.fillStyle = 'salmon';
            ctx.beginPath();
            ctx.arc(shooter.gun[i].x,shooter.gun[i].y,7,0,Math.PI*2,false);
            ctx.fill();
        }
        //detect gun hit in obstacles
        var ox,oy,or,gx,gy;
        for(var i =obstacles.length - 1 ;i >= 0;i--){
            ox = obstacles[i].x;
            oy = obstacles[i].y;
            or = obstacles[i].r;

            //loop for gun
        for(var j = shooter.gun.length -1;j >= 0;j --){
            gx = shooter.gun[j].x;
            gy = shooter.gun[j].y;

            //detect hits
            if(distBetweenPoints(ox,oy,gx,gy) < or){

                //remove gun
                shooter.gun.splice(j,1);

                //remove obstacles
              destroyObstacles(i);
                break;
            }
        }
        }

        // check for obstcles collission
        if(!exploding){
            if(shooter.blinkNum ==0){
                for(var i =0;i< obstacles.length;i++ ){
                    if(distBetweenPoints(shooter.x,shooter.y,obstacles[i].x,obstacles[i].y)< shooter.r +obstacles[i].r){
                        explodeShooter();
                        destroyObstacles(i);
                    }
            }
            
            }
    
        //rotate shooter
         shooter.a +=shooter.rot;
    
        //move shooter
    
        shooter.x +=shooter.thrust.x;
        shooter.y +=shooter.thrust.y;
        }else{
            shooter.explodeTime --;
            if(shooter.explodeTime ==0){
                shooter = newShooter();
            }
        }
       
        //handle edge of screen
        if(shooter.x < 0-shooter.r){
            shooter.x = canv.width + shooter.r;
        }
        else if (shooter.x > canv.width +shooter.r ){
            shooter.x = 0 - shooter.r;
        }

        if(shooter.y < 0-shooter.r){
            shooter.y = canv.height +shooter.r;
        }
        else if(shooter.y > canv.height +shooter.r ){
            shooter.y = 0 - shooter.r;
        }
        //move gun
        for(var i =shooter.gun.length-1;i>=0;i--){
            //check distance travelled
            if(shooter.gun[i].dist >GUN_DIST *canv.width){
                shooter.gun.splice(i,1);
                continue;
            }
            //move gun
            shooter.gun[i].x += shooter.gun[i].xv;
            shooter.gun[i].y += shooter.gun[i].yv;
           
           //calculate the distance travelled
           shooter.gun[i].dist +=Math.sqrt(Math.pow(shooter.gun[i].xv,2)+Math.pow(shooter.gun[i].yv,2));

           
            // handle edge
            if(shooter.gun[i].x <0){
                shooter.gun[i].x = canv.width;
            }else if(shooter.gun[i].x > canv.width){
                shooter.gun[i].x = 0;
            }
            if(shooter.gun[i].y <0){
                shooter.gun[i].y = canv.height;
            }else if(shooter.gun[i].y > canv.height){
                shooter.gun[i].y = 0;
            }
            
            
                
        }

         //move obstacles
        for(var i =0;i< obstacles.length;i++ ){
            obstacles[i].x += obstacles[i].xv;
        obstacles[i].y += obstacles[i].yv;
       //handle edge
       if(obstacles[i].x <0 - obstacles[i].r){
           obstacles[i].x = canv.width + obstacles[i].r;
       }
       else if(obstacles[i].x > canv.width + obstacles[i].r){
           obstacles[i].x = 0 - obstacles[i].r                        

       }
       if(obstacles[i].y <0 - obstacles[i].r){
           obstacles[i].y = canv.height + obstacles[i].r;
       }
       else if(obstacles[i].y > canv.height + obstacles[i].r){
           obstacles[i].y = 0 - obstacles[i].r                        

       }

        }
          
        

    //center of shooter
    ctx.fillStyle = 'green';
   ctx.fillRect(shooter.x -1,shooter.y - 1,2,2);
}