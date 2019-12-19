const FPS = 60; //frames in second
const SHOOTER_SIZE = 30; ///size in pixel
const TURN_SPEED = 360; //degree in second
const SHOOTER_THRUST = 5; //ACCELERATION
const FRICTION = 0.6; //friction coefficient
const OBS_NUM = 3; //starting no
const OBS_SPEED = 40;//staring speed of obstacles in pixel per second
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
const GUN_EXPLODE_DUR = 0.1 //duration of gun explosion
const TEXT_FADE_TIME = 2.5 //text fading in sec
const TEXT_SIZE = 40 //text font size in pixel
const GAME_LIFE = 3;//live in the game
const OBS_LARGE = 20; //points for large obstacles
const OBS_MEDIUM = 50; //points for medium obstacles
const OBS_SMALL = 100; //points for small obstacles
const SAVE_KEY_SCORE = "highscore"; // save key for local storage of high score
const SOUND_ON = true;
const MUSIC_ON = true;

//for automation
const AUTOMATION_ON = true;


//for neural network
const NUM_INPUTS = 4;
const NUM_HIDDEN = 20;
const NUM_OUTPUTS = 1;
const NUM_SAMPLES = 500000;//no of training samples
const OUTPUT_LEFT = 0; //expected neural output for left turn
const OUTPUT_RIGHT  = 1;//expected neural output for right turn
const OUTPUT_THRESHOLD = 0.5 ; // how close the prediction must be to control to a turn
const RATE_OF_FIRE = 25;//shot of fire



var canv = document.getElementById('gameCanvas');
var ctx = canv.getContext('2d');

//setting up the sound
var fxLaser = new Sound("./sounds/laser.m4a",5,0.5);
var fxExplode = new Sound("./sounds/explode.m4a");
var  fxHit = new Sound("./sounds/hit.m4a",5);
var fxThrust = new Sound("./sounds/thrust.m4a")

//setting up the music
 var music = new Music('./sounds/music-low.m4a','./sounds/music-high.m4a');
var obsLeft,obsTotal;


var level ,lives,score,scoreHigh, shooter,obstacles,text,textAlpha;
newGame();

//set up the neural network
var nn,aiShootTime = 0;
if (AUTOMATION_ON) {
    //
    nn = new NeuralNetwork(NUM_INPUTS,NUM_HIDDEN,NUM_OUTPUTS)
    //train the network
    let ox,oy,sa,sx,sy;
    for(let i = 0;i< NUM_SAMPLES;i++){
        
        //random obstacles location (include off-screen data)
        ox = Math.random()*(canv.width + OBS_SIZE)- OBS_SIZE/2;
        oy = Math.random()*(canv.height + OBS_SIZE)- OBS_SIZE/2;
       
        //shooter angle and position
        sa = Math.random() *Math.PI *2;
        sx =  shooter.x;
        sy = shooter.y;
        
        //calculate the angle to the obstacles
        let angle = angleToPoint(sx,sy,sa,ox,oy);

        //direction to turn
        let direction = angle > Math.PI ? OUTPUT_LEFT : OUTPUT_RIGHT;
       
        

        //train the network
        nn.train(noramlizeInput(ox,oy,angle,sa),[direction]);
    
    }
}


//event handlers

document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);

//set up the game loop;
setInterval(update,1000/FPS);


function angleToPoint(x,y,bearing,targetX,targetY){
    let angleToTarget = Math.atan2(-targetY + y,targetX -x);
    let diff = bearing - angleToTarget;
    return (diff + Math.PI *2) % (Math.PI *2);

}
function createObstacles(){
    obstacles = [];
    obsTotal =(OBS_NUM +level)* 7;
    obsLeft = obsTotal;
    var x,y;
    for(var i=0;i<OBS_NUM+level;i++){
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
        score += OBS_LARGE;

    }else if(r == Math.ceil(OBS_SIZE /4)){
        obstacles.push(newObstacles(x,y,Math.ceil(OBS_SIZE /8)));
        obstacles.push(newObstacles(x,y,Math.ceil(OBS_SIZE /8)));
        score += OBS_MEDIUM;
    }
    else{
        score += OBS_SMALL;
    }
    //check high score
    if (score > scoreHigh) {
        scoreHigh = score;
        localStorage.setItem(SAVE_KEY_SCORE, scoreHigh);
    }
    //destroy obstacles
    obstacles.splice(index,1);
    fxHit.play();
    
    //calculate the remaing obstacls
    obsLeft--;
    music.setObstaclesRatio(obsLeft == 0 ? 1: obsLeft/obsTotal);

    //new level when no obstaclea
    if(obstacles.length ==0){
        level++;
        newLevel();
    }
}

function distBetweenPoints(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}
var colour;

function drawShooter(x,y,a,colour = 'red'){
    ctx.strokeStyle = colour;
    ctx.lineWidth = SHOOTER_SIZE /20;
    ctx.beginPath();
ctx.moveTo(
    x + 4/3*shooter.r *Math.cos(a),
    y - 4/3*shooter.r *Math.sin(a)
);
ctx.lineTo(
    x - shooter.r *(2/3*Math.cos(a) + Math.sin(a)),
    y + shooter.r *(2/3*Math.sin(a)- Math.cos(a))
);

ctx.lineTo(
   x - shooter.r *(2/3*Math.cos(a) - Math.sin(a)),
    y + shooter.r *(2/3*Math.sin(a)+ Math.cos(a))
);
ctx.closePath();


ctx.stroke();
}

function explodeShooter(){
   shooter.explodeTime = Math.ceil(SHOT_EXPLODE_DUR *FPS);
    fxExplode.play();
}

function gameOver(){
    //over
    shooter.dead = true;
    text = 'GAME OVER';
    textAlpha = 1.0;
    if(shooter.dead == true){
        window.location='start.html';
    }

}
function keyDown(ev){
    if(shooter.dead || AUTOMATION_ON){
        return;
    }
    switch(ev.keyCode){
        case 37://left arrow(rotate left)
            //shooter.rot = TURN_SPEED /180 *Math.PI /FPS;
           rotateGun(false);
            break;
        case 32://space bar for shoot
           shootgun();
           
            break;
         case 38://up arrow(thrust)
            shooter.thrusting = true;
           
            break;  
        case 39://right arrow(rotate right)
        //shooter.rot = -TURN_SPEED /180 *Math.PI /FPS;
            rotateGun(true);
            break;  
    }
}
function keyUp(ev){
    if(shooter.dead || AUTOMATION_ON){
        return;
    }
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
    var levelMult = 1 + 0.5 *level;
    var obstacles ={
        x:x,
        y:y,
        xv : Math.random() * OBS_SPEED*levelMult /FPS * (Math.random() <0.5 ? 1 : -1),
        yv : Math.random() * OBS_SPEED*levelMult /FPS * (Math.random() <0.5 ? 1 : -1),
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
function newGame(){
    level = 0;
    lives = GAME_LIFE;
    score = 0;

    shooter = newShooter();

    var scoreStr = localStorage.getItem(SAVE_KEY_SCORE);
     if (scoreStr == null) {
                scoreHigh = 0;
         } else {
                scoreHigh = parseInt(scoreStr);
            }
    
    newLevel();
    
    
}
function newLevel(){
    text = "LEVEL" + (level +1);
    textAlpha = 1.0;
    createObstacles();
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
         dead:false,
         thrusting:false,
        thrust:{
            x:0,
            y:0
        }
    
    }

}

function noramlizeInput(obstaclesX,obstaclesY,obstaclesA,shooterA){
    //noramize the values to between 
    let input = [];
    input[0]  = (obstaclesX+OBS_SIZE/2)/(canv.width + OBS_SIZE);
    input[1]  = (obstaclesY+OBS_SIZE/2)/(canv.height + OBS_SIZE);
    input[2] = shooterA /(Math.PI*2);
    input[3] = obstaclesA /(Math.PI*2);
    return input;

}

function rotateGun(right){
    let sign = right ? -1 : 1;
    shooter.rot = TURN_SPEED /180 *Math.PI /FPS *sign;
   }
       
function shootgun(){
    //create gun object
    if(shooter.canShoot && shooter.gun.length < GUN_MAX){
        shooter.gun.push({
            x: shooter.x + 4/3*shooter.r *Math.cos(shooter.a),
            y:shooter.y - 4/3*shooter.r *Math.sin(shooter.a),
            xv:GUN_SPEED *Math.cos(shooter.a)/FPS,
            yv:-GUN_SPEED * Math.sin(shooter.a)/FPS,
            dist:0,
            explodeTime:0
        });
        fxLaser.play();
    }
    //prevent further shooting
    shooter.canShoot = false;
}

function  Music(srcLow,srcHigh){
    this.soundLow = new Audio(srcLow);
    this.soundHigh = new Audio(srcHigh);
    this.low = true;
    this.tempo = 1.0 //sec per bit
    this.beatTime = 0 //frames left until next beat


    this.play = function(){
        if(MUSIC_ON){
            if(this.low){
                this.soundLow.play();
    
            }else{
                this.soundHigh.play();
            }
            this.low  != this.low;
        }
      

    }
    this.setObstaclesRatio = function(ratio){
        this.tempo = 1.0 - 0.75*(1.0 - ratio);
    }
    this.tick = function(){
        if(this.beatTime ==0){
            this.play();
            this.beatTime = Math.ceil(this.tempo *FPS);

        }
        else{
            this.beatTime --;
        }
    }

}

function Sound(src,maxStreams = 1,vol= 1.0){
    this.streamNum = 0;
    this.streams = [];
    for(var i =0;i<maxStreams;i++){
        this.streams.push(new Audio(src));
        this.streams[i].volume = vol;

    }
    this.play = function(){
        if(SOUND_ON){
            this.streamNum = (this.streamNum+1)% maxStreams;
            this.streams[this.streamNum].play();
        }
        
    }
    this.stop = function(){
        this.streams[this.streamNum].pause();
        this.streams[this.streamNum].currentTime = 0;
    }

}

function update(){
    var blinkOn = shooter.blinkNum %2 == 0;

    var exploding = shooter.explodeTime >0;
    
    //use the neural to control and shoot 
    if(AUTOMATION_ON){
        //compute the closest obstacles
        let c = 0;
        let dist0 = distBetweenPoints(shooter.x,shooter.y,obstacles[0].x,obstacles[0].y);
        for(let i =1;i<obstacles.length;i++){
            let dist1 = distBetweenPoints(shooter.x,shooter.y,obstacles[i].x,obstacles[i].y);
           
            
            if(dist1 <dist0){
                dist1 = dist0;
                c= i;
           
                
            }

            
        }
        //make a prediction
        let ox = obstacles[c].x;
        let oy = obstacles[c].y;
        let sa = shooter.a;
        let sx = shooter.x;
        let sy =  shooter.y ;
        let angle = angleToPoint(sx,sy,sa,ox,oy);
        let predict = nn.feedForward(noramlizeInput(ox,oy,angle,sa)).data[0][0];
        //console.log(shooter.a);
        
        //make a turn
        let dLeft = Math.abs(predict-OUTPUT_LEFT);
        let dRight = Math.abs(predict-OUTPUT_RIGHT);

        if(dLeft < OUTPUT_THRESHOLD){
            rotateGun(false);
             shooter.x =shooter.x + Math.exp(0.05)
        
        }else if(dRight < OUTPUT_THRESHOLD){
            rotateGun(true);
             shooter.y =shooter.y + Math.log10(0.05);
            
        }else{
            //stop still
            shooter.rot = 0;

        }
        //shoot gun 
        if(aiShootTime ==0){
            aiShootTime = Math.ceil(FPS/RATE_OF_FIRE);
            shooter.canShoot = true;
            shootgun();
        }else{
            aiShootTime--;
        }
    }
    //ticking the music in the background
    music.tick();
    //draw background
    ctx.fillStyle  = 'black';
    ctx.fillRect(0,0,canv.width,canv.height);
    
     

    //thrusting
    if(shooter.thrusting && !shooter.dead ){
        shooter.thrust.x += SHOOTER_THRUST * Math.cos(shooter.a)/FPS;
        shooter.thrust.y -= SHOOTER_THRUST * Math.sin(shooter.a)/FPS;
        fxThrust.play();
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
        fxThrust.stop();
    }


    //draw shooter
    if(!exploding){
        if(blinkOn && !shooter.dead){
         drawShooter(shooter.x,shooter.y,shooter.a);
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
            ctx.fillStyle ='green';
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
                ctx.fill();
                if(SHOW_BOUNDING){
                    ctx.strokeStyle = 'red';
                    
                    ctx.beginPath();
                    ctx.arc(x,y,r,0,Math.PI *2,false);
                    ctx.stroke();
                }

           
        }
        //draw gun
        for(var i = 0;i<shooter.gun.length;i++ ){
            if(shooter.gun[i].explodeTime == 0){
                ctx.fillStyle = 'salmon';
                ctx.beginPath();
                ctx.arc(shooter.gun[i].x,shooter.gun[i].y,7,0,Math.PI*2,false);
                ctx.fill();
            }else{
                ctx.fillStyle = 'orange';
                ctx.beginPath();
                ctx.arc(shooter.gun[i].x,shooter.gun[i].y,shooter.r*0.75,0,Math.PI*2,false);
                ctx.fill();
                ctx.fillStyle = 'pink';
                ctx.beginPath();
                ctx.arc(shooter.gun[i].x,shooter.gun[i].y,shooter.r*0.5,0,Math.PI*2,false);
                ctx.fill();
                ctx.fillStyle = 'green';
                ctx.beginPath();
                ctx.arc(shooter.gun[i].x,shooter.gun[i].y,shooter.r*0.5,0,Math.PI*2,false);
                ctx.fill();
               
            }
            
        }

        //draw game text 
        if(textAlpha >=0){
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle ="rgba(255,255,255,"+ textAlpha +")";
            ctx.font = TEXT_SIZE +"px dejavu sans mono "
            ctx.fillText(text,canv.width/2,canv.height*0.75);
            textAlpha -=(1.0 / TEXT_FADE_TIME/FPS); 
        }else if (shooter.dead){
             newGame()
        }
        //draw lives
        var lifeColour;
        for(var i = 0 ;i<lives;i++ ){
            lifeColour = exploding && i == lives -1 ? 'yellow':'red';
            drawShooter(SHOOTER_SIZE + i * SHOOTER_SIZE *1.2, SHOOTER_SIZE,0.5 * Math.PI,lifeColour);
            
            
        }
        //draw the score board
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle ="white";
        ctx.font = TEXT_SIZE +"px dejavu sans mono "
        ctx.fillText(score,canv.width -SHOOTER_SIZE/2,SHOOTER_SIZE);
        
       
       // draw the high score
       ctx.textAlign = "center";
       ctx.textBaseline = "middle";
       ctx.fillStyle = "white";
       ctx.font = (TEXT_SIZE * 0.75) + "px dejavu sans mono";
       ctx.fillText("BEST " + scoreHigh, canv.width / 2, SHOOTER_SIZE);
        
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
            if( shooter.gun[j].explodeTime == 0 && distBetweenPoints(ox,oy,gx,gy) < or){

             

                //remove obstacles and activate gun explosion
              destroyObstacles(i);
              shooter.gun[j].explodeTime =  Math.ceil(GUN_EXPLODE_DUR * FPS);
                break;
            }
        }
        }

        // check for obstcles collission
        if(!exploding){
            if(shooter.blinkNum ==0 && !shooter.dead){
                for(var i =0;i< obstacles.length;i++ ){
                    if(distBetweenPoints(shooter.x,shooter.y,obstacles[i].x,obstacles[i].y)< shooter.r +obstacles[i].r){
                        
                        explodeShooter();
                        destroyObstacles(i);
                        break;
                    }
            }
            
            }
    
        //rotate shooter
         shooter.a +=shooter.rot;
            // keep the angle between 0 and 360
            if(shooter.a <0){
                shooter.a +=(Math.PI *2);
            }else if( shooter.a >=(Math.PI *2)){
                shooter.a -=(Math.PI *2);
            }
        //move shooter
    
        shooter.x +=shooter.thrust.x;
        shooter.y +=shooter.thrust.y;
        }else{
            shooter.explodeTime --;
            if(shooter.explodeTime == 0){
                lives--;
                if(lives == 0){
                    gameOver();


                }else{
                    shooter = newShooter();
                }
                
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
            //handle the explosion
            if(shooter.gun[i].explodeTime >0){
                shooter.gun[i].explodeTime --;
                
                //destroy gun
                if(shooter.gun[i].explodeTime == 0){
                    shooter.gun.splice(i,1);
                    continue;
                }
            }else{
                 //move gun
            shooter.gun[i].x += shooter.gun[i].xv;
            shooter.gun[i].y += shooter.gun[i].yv;
           
           //calculate the distance travelled
           shooter.gun[i].dist +=Math.sqrt(Math.pow(shooter.gun[i].xv,2)+Math.pow(shooter.gun[i].yv,2));

            }
           
           
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