function getRandomNumber(min,max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) ) + min;
}

// function HighScoreBoard(height, width, parentClass) {

// }

function ScoreBoard(height, width, parentClass) {
    this.height = height;
    this.width = width;

    this.stepIncrement = 10;

    this.score = 0;

    this.left = 50;

    this.scoreBoardElement;
    this.scoreIndicatorElement;

    this.init = function() {
        this.scoreBoardElement = document.createElement('div');
        this.scoreBoardElement.innerHTML = 'score';

        this.scoreIndicatorElement = document.createElement('span');
        this.scoreIndicatorElement.style.display = 'block';
        this.scoreIndicatorElement.innerHTML = this.score;

        this.scoreBoardElement.appendChild(this.scoreIndicatorElement);

        this.scoreBoardElement.style.height = this.height+'px';
        this.scoreBoardElement.style.minWidth = this.width+'px';

        this.scoreBoardElement.style.marginTop = '50px';

        this.scoreBoardElement.style.position = 'absolute';
        this.scoreBoardElement.style.left = this.left+'px';

        
        this.scoreBoardElement.style.background = '#20261F';
        this.scoreBoardElement.style.background = '-webkit-linear-gradient(left, #20261F 0%, #C5D86D 100%)';

        this.scoreBoardElement.style.fontSize = '36px';
        this.scoreBoardElement.style.textAlign = 'center';

        return this.scoreBoardElement;
    }

    this.updateScore = function() {
        this.score += this.stepIncrement;
        this.draw();
    }

    this.draw = function() {
        this.scoreIndicatorElement.innerHTML = this.score;
    }
}

function Enemy(height, width ,parentClass) {
    this.height = height;
    this.width = width;

    this.intervalId;

    this.pedestrialElement;

    this.genrateInLane = getRandomNumber(1, 4);

    this.top = - this.height;
    this.left = this.genrateInLane === 1 ? parentClass.racerClass.MIN_LEFT : ((this.genrateInLane - 1) * parentClass.racerClass.offSetValue) + parentClass.racerClass.MIN_LEFT;

    this.init = function() {
        this.pedestrianElement = document.createElement('div');

        this.pedestrianElement.style.height = this.height+'px';
        this.pedestrianElement.style.width = this.width+'px';

        this.pedestrianElement.style.backgroundImage = 'url(./images/car'+getRandomNumber(1, 4)+'.png)';
        this.pedestrianElement.style.backgroundRepeat = 'no-repeat';
        this.pedestrianElement.style.backgroundSize = '100% 100%';

        this.pedestrianElement.style.position = 'absolute';
        this.pedestrianElement.style.top = this.top+'px';
        this.pedestrianElement.style.left = this.left+'px';

        this.move();

        return this.pedestrianElement;
    }

    this.detectCollisionY = function() {
        if (this.top >= parentClass.height) {
            return true;
            //document.getElementsByClassName('ant').innerHTML = 'CRASHED';
           // console.log('crashed');
            
        } else {
            return false;
        }
    }

    this.move = function() {
        this.intervalId = setInterval(function() {
            this.top += parentClass.backgroundClass.dx;
            if (this.detectCollisionY()) {
                parentClass.gameElement.removeChild(this.pedestrianElement);
                parentClass.removePedestrian(this.pedestrianElement);
                
                parentClass.scoreBoardClass.updateScore();
                clearInterval(this.intervalId);
            }
            parentClass.initCollisionDetection(this);
            this.draw();
        }.bind(this), parentClass.backgroundClass.increaseInInterval);
    }

    this.draw = function() {
        this.pedestrianElement.style.top = this.top+'px';
    }
    
}

function Racer(height, width, parentClass) {
    this.height = height;
    this.width = width;

    this.inLane = 1;

    this.MIN_LEFT = 15;

    this.top = (parentClass.height - this.height);
    this.left = this.MIN_LEFT;

    this.offSetValue = 70;

    this.racerElement;

    this.init = function() {
        this.racerElement = document.createElement('div');

        this.racerElement.style.height = this.height+'px';
        this.racerElement.style.width = this.width+'px';

        this.racerElement.style.backgroundImage = 'url(./images/run.png)';
        this.racerElement.style.backgroundRepeat = 'no-repeat';
        this.racerElement.style.backgroundSize = '100% 100%';

        this.racerElement.style.position = 'absolute';
        this.racerElement.style.top = this.top+'px';
        this.racerElement.style.left = this.left+'px';

        return this.racerElement;
    }

    this.detectCollisionX = function() {
        if (this.left <= 0 || this.left >= parentClass.width - this.width) {
            return true;
            document.getElementsByClassName('ant').innerHTML = 'CRASHED';
            
        } else {
            return false;
        }
    }

    this.moveRight = function() {
        this.left += this.offSetValue;
        if (this.detectCollisionX()) {
            this.left -= this.offSetValue;
        } else {
            this.inLane++;
            this.draw();
        }
    }

    this.moveLeft = function() {
        this.left -= this.offSetValue;
        if(this.detectCollisionX()) {
            this.left += this.offSetValue;
        } else {
            this.inLane--;
            this.draw();
        }
    }

    this.draw = function() {
        this.racerElement.style.left = this.left+'px';
    }
}

function Background(height, width, scaleFactor, parentClass) {
    this.height = scaleFactor *  height;
    this.width = width;

    this.intervalId;

    this.scaleFactor = scaleFactor;

    this.MAX_VELOCITY = 15;
    this.increaseRate = 0.0006;

    this.top = - (this.scaleFactor - 1) * parentClass.height;

    this.dx = 1.5;

    this.increaseInInterval = 5;

    this.gameBackgroundElement;

    this.init = function() {
        this.gameBackgroundElement = document.createElement('div');

        this.gameBackgroundElement.style.width = this.width+'px';
        this.gameBackgroundElement.style.height = this.height+'px';

        this.gameBackgroundElement.style.position = 'absolute';

        this.gameBackgroundElement.style.backgroundImage = 'url(./images/lane.png)';
        this.gameBackgroundElement.style.backgroundPosition = 'top -left';
        this.gameBackgroundElement.style.backgroundRepeat = 'repeat-y';
        this.gameBackgroundElement.style.backgroundSize = '100%';

        this.gameBackgroundElement.style.top = this.top+'px';

        this.move();
        return this.gameBackgroundElement;
    }

    this.move = function() {
        this.intervalId = setInterval(function() {
            this.dx = this.dx >= this.MAX_VELOCITY ? this.MAX_VELOCITY : this.dx;
            this.top += this.dx;
            this.dx += this.increaseRate;
            this.top = this.top >= 0 ? - (this.scaleFactor - 1) * parentClass.height : this.top;
            this.draw();
        }.bind(this),this.increaseInInterval);
    }

    this.draw = function() {
        this.gameBackgroundElement.style.top = this.top+'px';
    }

}

function Game(width, height, userName, parentElement) {

    var that = this;

    this.userName = userName;

    this.carHeight = 50;
    this.carWidth = 30;

    this.scoreHeight = 100;
    this.scoreWidth = 100;

    this.width = width;
    this.height = height;

    this.pedestrians = [];
    this.pedestriansGeneratingIntervalId;
    this.pedestriansGeneratingDelay = 10;
    this.pedestrianGappingOffset = 50;
    this.pedestrianGappingOffsetIncrementStep = 0.009;
    this.MAX_PEDESTRIAN_GAPPING_OFFSET = 150;

    this.backgroundScale = 10;

    this.gameElement;

    this.backgroundClass;
    this.racerClass;
    this.scoreBoardClass;

    this.initGame = function() {
        this.gameElement = document.createElement('div');

        this.gameElement.style.height = this.height+'px';
        this.gameElement.style.width = this.width+'px';
        this.gameElement.style.position = 'relative';
        this.gameElement.style.margin = '0px auto';
        this.gameElement.style.overflow = 'hidden';

        this.initBackground();
        this.initRacer();
        this.initInputsRead();
        this.initPedestrains();
        this.initScoreBoard();

        return this.gameElement;
    }

    this.initScoreBoard = function() {
        this.scoreBoardClass = new ScoreBoard(this.scoreHeight, this.scoreWidth, this);
        parentElement.appendChild(this.scoreBoardClass.init());
    }

    this.initBackground = function() {
        this.backgroundClass = new Background(this.height, this.width, this.backgroundScale, this);
        this.gameElement.appendChild(this.backgroundClass.init());
    }

    this.initRacer = function() {
        this.racerClass = new Racer(this.carHeight, this.carWidth, this);
        this.gameElement.appendChild(this.racerClass.init());
    }

    this.initCollisionDetection = function(withPedestrian) {
        if (withPedestrian.genrateInLane === this.racerClass.inLane && withPedestrian.top + withPedestrian.height  > this.racerClass.top) {
            this.gameOver();
        }
    }

    this.distaceOk = function(pedestrian) {
        var okToGenrate = true;
        this.pedestrians.forEach(function(element) {
            if ((pedestrian.genrateInLane - element.genrateInLane) <= 1) {
                if (element.top - (pedestrian.top + pedestrian.height)< this.racerClass.height + this.pedestrianGappingOffset) {
                    okToGenrate = false;
                }
            }
        }.bind(this));
        this.pedestrianGappingOffset += this.pedestrianGappingOffsetIncrementStep;
        this.pedestrianGappingOffset = this.pedestrianGappingOffset >= this.MAX_PEDESTRIAN_GAPPING_OFFSET ? this.MAX_PEDESTRIAN_GAPPING_OFFSET : this.pedestrianGappingOffset;
        return okToGenrate;
    }

    this.initPedestrains = function() {
        this.pedestriansGeneratingIntervalId = setInterval(function() {
            var pedestrian = new Enemy(this.carHeight, this.carWidth ,this);
            if (this.distaceOk(pedestrian)) {
                this.pedestrians.push(pedestrian);
                this.gameElement.appendChild(pedestrian.init());
            } else {
                delete(pedestrian);
            }
            
        }.bind(this),this.pedestriansGeneratingDelay);
    }

    this.removePedestrian = function(pedestrianElement) {
        this.pedestrians = this.pedestrians.filter(function(pedestrian) {
            return pedestrian.pedestrianElement != pedestrianElement;
        });
    }

    this.initInputsRead = function() {
        document.addEventListener('keyup', this.inputFunction);
    }

    this.inputFunction = function(event) {
        if (event.code === 'ArrowRight' || event.code === 'KeyD') {
            that.racerClass.moveRight();
        } else if (event.code === 'ArrowLeft'|| event.code === 'KeyA') {
            that.racerClass.moveLeft();
        }
    }

    this.gameOver = function() {
        clearInterval(this.pedestriansGeneratingIntervalId);
        clearInterval(this.backgroundClass.intervalId);
        this.pedestrians.forEach(function(element) {
            clearInterval(element.intervalId);
        });
        document.removeEventListener('keyup',this.inputFunction);
    }
}

function StartScreen(parentElement) {
    this.startScreenElement;
    this.playerName;

    this.init = function() {
        this.startScreenElement = document.createElement('div');
        this.startScreenElement.style.position = 'relative';

        this.startScreenElement.style.width = '500px';
        this.startScreenElement.style.height = '720px';

        this.startScreenElement.style.backgroundImage = 'url(./images/logo.jpg)';
        this.startScreenElement.style.backgroundPosition = 'center';
        this.startScreenElement.style.backgroundSize = 'contain';
        this.startScreenElement.style.backgroundRepeat = 'repeat';

        this.startScreenElement.style.borderRadius = '50%';
        this.startScreenElement.style.boxShadow = '0px 0px 20px grey';
        this.startScreenElement.style.margin = '0 auto';

        

        var button = document.createElement('div');
        button.innerHTML = 'RACE';
        button.style.color = '#d3d3d3';
        button.style.width = '175px';
        button.style.textAlign = 'center';
        button.style.border = '0';
        button.style.paddingLeft = '10px';
        button.style.position = 'absolute';
        button.style.lineHeight = '44px';
        button.style.top = '350px';
        button.style.borderRadius = '10px';
        button.style.left = '165px';
        button.style.background = '#577425';
        button.onmouseover = function() {
            button.style.cursor = 'pointer';
            button.style.background = '#577425';
        }
        button.onmouseout = function() {
            button.style.background = '#261C15';
        }
        button.onclick = function() {
            
            var audio = document.createElement("AUDIO")
            document.body.appendChild(audio);
            audio.src = "carsound.wav"
            
            
             audio.play();
             
               
             parentElement.appendChild(new Game(200, 720, this.playerName, parentElement).initGame());
                parentElement.removeChild(this.startScreenElement);
            
        }.bind(this);
        this.startScreenElement.appendChild(button);

        return this.startScreenElement;
    }
}



window.onload = function() {
    var app = this.document.getElementsByClassName('app');
    app.item(0).style.background = 'url(https://image.freepik.com/free-photo/empty-sand-textures_74190-2071.jpg)';
    
    app.item(0).appendChild(new this.StartScreen(app.item(0)).init());

}


