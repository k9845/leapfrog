function getRandomNumber(min,max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) ) + min;
}

function HighScoreBoard(height, width, parentClass) {
    var localStorage = window.localStorage;

    this.highScore = 0;

    this.height = height;
    this.width = width;

    this.highScoreBoardElement;
    this.highScoreIndicatorElement;

    this.left = 900;

    this.init = function() {
        this.highScoreBoardElement = document.createElement('div');
        this.highScoreBoardElement.innerHTML = 'High Score';
        
        this.highScoreIndicatorElement = document.createElement('span');
        this.highScoreIndicatorElement.style.display = 'block';
        this.highScoreIndicatorElement.innerHTML = this.highScore;

        this.highScoreBoardElement.appendChild(this.highScoreIndicatorElement);

        this.highScoreBoardElement.style.height = this.height+'px';
        this.highScoreBoardElement.style.minWidth = this.width+'px';
        this.highScoreBoardElement.style.marginTop = '60px';
        this.highScoreBoardElement.style.position = 'absolute';
        this.highScoreBoardElement.style.left = this.left+'px';
        
        this.highScoreBoardElement.style.background = 'red';
        this.highScoreBoardElement.style.background = '-webkit-linear-gradient(left, red 0%, red 100%)';
        this.highScoreBoardElement.style.fontSize = '36px';
        this.highScoreBoardElement.style.textAlign = 'center';

        return this.highScoreBoardElement;
    }

    this.getHighScore = function() {
        this.highScore = parseInt(localStorage.getItem('highScore'));
    }

    this.setHighScore = function() {
        this.getHighScore();
        if (!this.highScore) {
            this.highScore = 0;
        }
        if (parentClass.scoreBoardClass.score > this.highScore) {
            this.highScore = parentClass.scoreBoardClass.score;
        }
        this.store();
    }

    this.store = function() {
        localStorage.setItem('highScore', this.highScore);
        this.draw();
    }

    this.draw = function() {
        this.highScoreIndicatorElement.innerHTML = this.highScore;
    }
}

function ScoreBoard(height, width, parentClass) {
    this.height = height;
    this.width = width;

    this.stepIncrement = 10;

    this.score = 0;

    this.left = 50;

    this.scoreBoardElement;
    this.scoreIndicatorElement;

    this.reset = function() {
        this.score = 0;
        this.draw();
    }

    this.init = function() {
        this.scoreBoardElement = document.createElement('div');
        this.scoreBoardElement.innerHTML = 'SCORE';

        this.scoreIndicatorElement = document.createElement('span');
        this.scoreIndicatorElement.style.display = 'block';
        this.scoreIndicatorElement.innerHTML = this.score;

        this.scoreBoardElement.appendChild(this.scoreIndicatorElement);

        this.scoreBoardElement.style.height = this.height+'px';
        this.scoreBoardElement.style.minWidth = this.width+'px';

        this.scoreBoardElement.style.marginTop = '60px';

        this.scoreBoardElement.style.position = 'absolute';
        this.scoreBoardElement.style.left = this.left+'px';

        
        this.scoreBoardElement.style.background = '#7494EA';
        this.scoreBoardElement.style.background = '-webkit-linear-gradient(left, #7494EA 0%,#7494EA 100%)';

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

    this.dx = parentClass.backgroundClass.dx + 0.2;

    this.MAX_DX = parentClass.backgroundClass.MAX_VELOCITY + 0.2;

    this.intervalId;

    this.pedestrianElement;

    this.genrateInLane = getRandomNumber(1, 4);

    this.top = - this.height;
    this.left = this.genrateInLane === 1 ? parentClass.racerClass.MIN_LEFT : ((this.genrateInLane - 1) * parentClass.racerClass.offSetValue) + parentClass.racerClass.MIN_LEFT;

    this.getSpeed= function() {
        this.dx += parentClass.backgroundClass.increaseRate;
        return this.dx >= this.MAX_DX ? this.MAX_DX : this.dx;
    }

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
        } else {
            return false;
        }
    }

    this.move = function() {
        this.intervalId = setInterval(function() {
            this.top += this.getSpeed();
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

function BulletCartridge(height, width, parentClass) {
    this.height = height;
    this.width = width;

    this.top = -this.height;

    this.inLane = getRandomNumber(1, 4);

    this.intervalId;

    this.dx = parentClass.backgroundClass.dx;

    this.bulletCartridgeElement;

    this.init = function() {
        this.bulletCartridgeElement = document.createElement('div');

        this.bulletCartridgeElement.style.width = this.width + 'px';
        this.bulletCartridgeElement.style.height = this.height + 'px';

        this.bulletCartridgeElement.style.position = 'absolute';

        this.bulletCartridgeElement.style.top = this.top +'px';
        this.bulletCartridgeElement.style.left =  (this.inLane - 1) * parentClass.racerClass.offSetValue + parentClass.racerClass.MIN_LEFT + 'px';


        this.bulletCartridgeElement.style.backgroundImage = 'url(./images/bullet.png)';
        this.bulletCartridgeElement.style.backgroundSize = '100% 100%';
        this.bulletCartridgeElement.style.backgroundRepeat = 'no-repeat';

        return this.bulletCartridgeElement;
    }

    this.reachedTheEnd = function() {
        if (this.top > parentClass.height) {
            parentClass.gameElement.removeChild(this.bulletCartridgeElement);
            clearInterval(this.intervalId);
        }
    }

    this.collisionWithRacer = function() {
        if (this.inLane === parentClass.racerClass.inLane && this.top + this.height > parentClass.height - parentClass.racerClass.height) {
            parentClass.gameElement.removeChild(this.bulletCartridgeElement);
            clearInterval(this.intervalId);
            parentClass.racerClass.increaseBullet();
        }
    }

    this.move = function() {
        this.intervalId = setInterval(function() {
            this.top += this.dx;
            this.draw();
            this.reachedTheEnd();
            this.collisionWithRacer();
        }.bind(this),parentClass.backgroundClass.increaseInInterval);
    }

    this.draw = function() {
        this.bulletCartridgeElement.style.top = this.top +'px';
    }
}

function Bullet(height, width, parentClass) {
    this.bulletElement;
    
    this.height = height;
    this.width = width;

    this.intervalId;

    this.shooting;

    this.dx = 10;

    this.genrateInLane;

    this.left;
    this.top = parentClass.height - parentClass.racerClass.height - 10;

    this.init = function() {
        this.bulletElement = document.createElement('div');

        this.bulletElement.style.height = this.height + 'px';
        this.bulletElement.style.width = this.width + 'px';

        this.bulletElement.style.backgroundImage = 'url(./images/bullet.png)';
        this.bulletElement.style.backgroundSize = '100% 100%';
        this.bulletElement.style.backgroundRepeat = 'no-repeat';

        this.bulletElement.style.position = 'absolute';
        this.bulletElement.style.top = this.top +'px';

        this.genrateInLane = parentClass.racerClass.inLane;
        this.left = this.genrateInLane === 1 ? parentClass.racerClass.MIN_LEFT : ((this.genrateInLane - 1) * parentClass.racerClass.offSetValue) + parentClass.racerClass.MIN_LEFT;

        this.bulletElement.style.left = this.left+'px';

        return this.bulletElement;
    }

    this.detectCollisionX = function() {
        if (this.top <= 0) {
            parentClass.racerClass.bulletShooting = false;
            parentClass.gameElement.removeChild(this.bulletElement);
            clearInterval(this.intervalId);
        }
    }

    this.detectCollisionWithPedestrian = function() {
        parentClass.pedestrians.forEach(function(element) {
            if (this.genrateInLane === element.genrateInLane) {
                if (element.top + element.height > this.top) {
                    parentClass.racerClass.bulletShooting = false;
                    parentClass.gameElement.removeChild(this.bulletElement);
                    clearInterval(this.intervalId);
                    parentClass.removePedestrian(this);
                }
            }
        }.bind(this));
    }

    this.fireBullet = function() {
        this.intervalId = setInterval(function() {
            this.top -= this.dx;
            this.draw();
            this.detectCollisionWithPedestrian();
            this.detectCollisionX();
        }.bind(this), 10);
    }

    this.draw = function() {
        this.bulletElement.style.top = this.top +'px';
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

    this.bulletLeft = 10;
    this.bulletIncreaseBy = 10;
    this.bulletShooting = false;

    this.racerElement;

    this.increaseBullet = function() {
        this.bulletLeft += this.bulletIncreaseBy;
    }

    this.reset = function() {
        this.bulletLeft = 10;
    }

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

    this.MAX_VELOCITY = 8;
    this.increaseRate = 0.0009;

    this.top = - (this.scaleFactor - 1) * parentClass.height;

    this.dx = 1;

    this.increaseInInterval = 10;

    this.gameBackgroundElement;

    this.reset = function() {
        this.dx = 1;
    }

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

function Game(width, height, parentElement, parentClass) {

    var that = this;

    

    this.carHeight = 50;
    this.carWidth = 30;

    this.scoreHeight = 100;
    this.scoreWidth = 200;

    this.width = width;
    this.height = height;

    this.bulletCartridgeGenratingId;

    this.pedestrians = [];

    this.pedestriansGeneratingIntervalId;
    this.pedestriansGeneratingDelay = 10;
    this.pedestrianGappingOffset = 30;
    this.pedestrianGappingOffsetIncrementStep = 0.009;
    this.MAX_PEDESTRIAN_GAPPING_OFFSET = 80;

    this.backgroundScale = 10;

    this.gameElement;
    this.backgroundClass;
    this.racerClass;
    this.scoreBoardClass;
    this.highScoreBoardClass;
    this.bulletClass;
    this.bulletCartridgeClass;

    this.init = function() {
        this.gameElement = document.createElement('div');

        this.gameElement.style.height = this.height+'px';
        this.gameElement.style.width = this.width+'px';
        this.gameElement.style.position = 'relative';
        this.gameElement.style.margin = '0px auto';
        this.gameElement.style.overflow = 'hidden';

        this.startGame();

        return this.gameElement;
    }

    this.startGame = function() {
        this.initBackground();
        this.initRacer();
        this.initInputsRead();
        this.initPedestrains();
        this.initBulletCartridge();
        this.initScoreBoard();
        this.initHighScoreBoard();
    }

    this.initBulletCartridge = function() {
        this.bulletCartridgeGenratingId = setInterval(function() {
            this.bulletCartridgeClass = new BulletCartridge(20, 20, this);
            this.gameElement.appendChild(this.bulletCartridgeClass.init());
            this.bulletCartridgeClass.move();
        }.bind(this),10000);
    }

    this.initHighScoreBoard = function() {
        this.highScoreBoardClass = new HighScoreBoard(this.scoreHeight , this.scoreWidth , this);
        var tempElement = this.highScoreBoardClass.init();
        this.highScoreBoardClass.setHighScore();
        parentElement.appendChild(tempElement);
    }

    this.gameOver = function() {
        clearInterval(this.pedestriansGeneratingIntervalId);
        clearInterval(this.backgroundClass.intervalId);
        if (this.bulletCartridgeClass) {
            clearInterval(this.bulletCartridgeClass.intervalId);
        }
        clearInterval(this.bulletCartridgeGenratingId);
        this.pedestrians.forEach(function(element) {
            clearInterval(element.intervalId);
        });
        document.removeEventListener('keyup',this.inputFunction);
        this.highScoreBoardClass.setHighScore();
        parentElement.appendChild(new EndScreen(parentElement, this).init());
    }

    this.restartGame = function() {
        // if (this.bulletCartridgeClass) {
        //     this.gameElement.removeChild(this.bulletCartridgeClass.bulletCartridgeElement);
        // }
        this.pedestrians.forEach(function(element) {
            this.gameElement.removeChild(element.pedestrianElement);
        }.bind(this));
        this.pedestrians.forEach(function(element) {
            delete(element);
        });
        this.pedestrians = [];
        this.racerClass.reset();
        this.backgroundClass.reset();
        this.scoreBoardClass.reset();
        this.backgroundClass.move();
        document.addEventListener('keyup',this.inputFunction);
        this.initPedestrains();
        this.initBulletCartridge();
    }

    this.exitGame = function() {
        this.pedestrians.forEach(function(element) {
            this.gameElement.removeChild(element.pedestrianElement);
        }.bind(this));
        this.pedestrians.forEach(function(element) {
            delete(element);
        });
        this.pedestrians = [];
        this.gameElement.removeChild(this.racerClass.racerElement);
        this.gameElement.removeChild(this.backgroundClass.gameBackgroundElement);
        parentElement.removeChild(this.gameElement);
        parentElement.removeChild(this.scoreBoardClass.scoreBoardElement);
        parentElement.removeChild(this.highScoreBoardClass.highScoreBoardElement);
        if (this.bulletCartridgeClass) {
            this.gameElement.removeChild(this.bulletCartridgeClass.bulletCartridgeElement);
        }
        parentClass.reset();
        parentElement.appendChild(parentClass.startScreenElement);
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
                if (element.top - (pedestrian.top + pedestrian.height) < this.racerClass.height + this.pedestrianGappingOffset) {
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
        if (pedestrianElement instanceof HTMLElement) {
            this.pedestrians = this.pedestrians.filter(function(pedestrian) {
                return pedestrian.pedestrianElement != pedestrianElement;
            });
        } else if (pedestrianElement instanceof Bullet){
            for (var i = 0; i < this.pedestrians.length; i++) {
                if (this.pedestrians[i].genrateInLane === pedestrianElement.genrateInLane && this.pedestrians[i].top + this.pedestrians[i].height > pedestrianElement.top) {
                    this.gameElement.removeChild(this.pedestrians[i].pedestrianElement);
                    clearInterval(this.pedestrians[i].intervalId);
                    this.pedestrians.splice(i, 1);
                }
            }
        }
    }

    this.initInputsRead = function() {
        document.addEventListener('keyup', this.inputFunction);
    }

    this.inputFunction = function(event) {
        if (event.code === 'ArrowRight' || event.code === 'KeyD') {
            that.racerClass.moveRight();
        } else if (event.code === 'ArrowLeft'|| event.code === 'KeyA') {
            that.racerClass.moveLeft();
        } else if (event.code === 'Space') {
            if (this.racerClass.bulletLeft > 0 && !this.racerClass.bulletShooting) {
                this.racerClass.bulletShooting = true;
                this.bulletClass = new Bullet(40, 30, this);
                this.gameElement.appendChild(this.bulletClass.init());
                this.bulletClass.fireBullet();
                this.racerClass.bulletLeft --;
                this.racerClass.bulletLeft = this.racerClass.bulletLeft < 0 ? 0 : this.racerClass.bulletLeft;
            }
        }
    }.bind(this);
}

function EndScreen(parentElement, gameClass) {
    this.endScreenElement;

    this.init = function() {
        this.endScreenElement = document.createElement('div');
        this.endScreenElement.style.position = 'absolute';

        this.endScreenElement.style.width = '500px';
        this.endScreenElement.style.height = '720px';

        this.endScreenElement.style.backgroundImage = 'url(./images/logo.jpg)';
        this.endScreenElement.style.backgroundPosition = 'center';
        this.endScreenElement.style.backgroundSize = 'contain';
        this.endScreenElement.style.backgroundRepeat = 'repeat';
        this.endScreenElement.style.top = '0px';
        this.endScreenElement.style.left = '310px';

        this.endScreenElement.style.borderRadius = '10%';

        var buttonRestart = document.createElement('div');
        buttonRestart.innerHTML = 'Restart Game';
        buttonRestart.style.color = '#44CCFF';
        buttonRestart.style.width = '175px';
        buttonRestart.style.textAlign = 'center';
        buttonRestart.style.border = '0';
        buttonRestart.style.paddingLeft = '10px';
        buttonRestart.style.position = 'absolute';
        buttonRestart.style.lineHeight = '44px';
        buttonRestart.style.top = '400px';
        buttonRestart.style.borderRadius = '10px';
        buttonRestart.style.left = '165px';
        buttonRestart.style.background = '#577425';
        buttonRestart.onmouseover = function() {
            buttonRestart.style.cursor = 'pointer';
            buttonRestart.style.background = '#5A8118';
        }
        buttonRestart.onmouseout = function() {
            buttonRestart.style.background = '#577425';
        }
        buttonRestart.onclick = function() {
            gameClass.restartGame();
            parentElement.removeChild(this.endScreenElement);
        }.bind(this);

        this.endScreenElement.appendChild(buttonRestart);

        var button = document.createElement('div');
        button.innerHTML = 'Exit Game';
        button.style.color = '#44CCFF';
        button.style.width = '175px';
        button.style.textAlign = 'center';
        button.style.border = '0';
        button.style.paddingLeft = '10px';
        button.style.position = 'absolute';
        button.style.lineHeight = '44px';
        button.style.top = '450px';
        button.style.borderRadius = '10px';
        button.style.left = '165px';
        button.style.background = 'red';
        button.onmouseover = function() {
            button.style.cursor = 'pointer';
            button.style.background = '#5A8118';
        }
        button.onmouseout = function() {
            button.style.background = 'red';
        }
        button.onclick = function() {
            gameClass.exitGame();
            parentElement.removeChild(this.endScreenElement);
        }.bind(this);

        this.endScreenElement.appendChild(button);

        return this.endScreenElement;
    }
}

function StartScreen(parentElement) {
    this.startScreenElement;
    this.playerName;

    this.input;

    this.gameClass;

    this.reset = function() {
        
        this.draw();
    }

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
       
        this.startScreenElement.style.margin = '0 auto';

        

        var button = document.createElement('div');
        button.innerHTML = 'RACE';
        button.style.color = 'red';
        button.style.width = '175px';
        button.style.textAlign = 'center';
        button.style.border = '0';
        button.style.paddingLeft = '10px';
        button.style.position = 'absolute';
        button.style.lineHeight = '44px';
        button.style.top = '300px';
        button.style.borderRadius = '10px';
        button.style.left = '165px';
        button.style.background = '#5F4B68';
        button.onmouseover = function() {
            button.style.cursor = 'pointer';
            button.style.background = '#5F4B68';
        }
        button.onmouseout = function() {
            button.style.background = '#5F4B68';
        }
        button.onclick = function() {
            
            
                this.gameClass = new Game(200, 720, parentElement, this);
                parentElement.removeChild(this.startScreenElement);
                parentElement.appendChild(this.gameClass.init());
                
           
        }.bind(this);
        this.startScreenElement.appendChild(button);

        return this.startScreenElement;
    }

   
}

window.onload = function() {
    var app = this.document.getElementsByClassName('app');

    app.item(0).style.background = 'url(https://image.freepik.com/free-photo/empty-sand-textures_74190-2071.jpg)';
    new HighScoreBoard().init();
    
    app.item(0).appendChild(new this.StartScreen(app.item(0)).init());
}