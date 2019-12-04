function Pipe(height, width, top, flip, parentClass) {
    this.height = height;
    this.width = width;

    this.directionY = parentClass.gameBackgroundClass.directionY;
    this.intervalRepeatTime = parentClass.gameBackgroundClass.intervalRepeatTime;


    this.top = top;
    this.left = parentClass.width;

    this.zIndex = 10;

    this.birdPassed = false;

    this.pipeMovingIntervalId;

    this.pipeElement;

    this.init = function() {
        this.pipeElement = document.createElement('div');

        this.pipeElement.style.position = 'absolute';

        this.pipeElement.style.top = this.top+ 'px';
        this.pipeElement.style.left = this.left+'px';

        this.pipeElement.style.zIndex = this.zIndex;

        this.pipeElement.style.height = this.height + 'px';
        this.pipeElement.style.width = this.width + 'px';

        this.pipeElement.style.backgroundImage = 'url(./images/pipe.png)';
        this.pipeElement.style.backgroundPosition = 'center';
        this.pipeElement.style.backgroundSize = '100% 100%';

        if (flip) {
            this.pipeElement.style.transform = 'ScaleY(-1)';
        }

        this.move();

        return this.pipeElement;
    }

    this.collisionDetection = function() {
        if (parentClass.birdClass.left + parentClass.birdClass.width > this.left + (this.width / 2) && !this.birdPassed) {
            parentClass.scoreClass.scored();
            this.birdPassed = true;
        }
        if (flip) {
            if (this.left < parentClass.birdClass.left + parentClass.birdClass.width && this.left + this.width > parentClass.birdClass.left && this.height + this.top > parentClass.birdClass.top) {
              
                parentClass.gameOver();
            }
        } else {
            if (this.left < parentClass.birdClass.left + parentClass.birdClass.width && this.top < parentClass.birdClass.top + parentClass.birdClass.height && this.left + this.width > parentClass.birdClass.left) {
                
                parentClass.gameOver();
            }
        }
    }

    this.move = function() {
        this.pipeMovingIntervalId = setInterval(function() {
            this.collisionDetection();
            this.left -= this.directionY;
            this.draw();
            if (this.left + this.width <= 0) {
                parentClass.gameContainerElement.removeChild(this.pipeElement);
                parentClass.removePipe(this.pipeElement);
                clearInterval(this.pipeMovingIntervalId);
            }
        }.bind(this),this.intervalRepeatTime);
    }

    this.draw = function() {
        this.pipeElement.style.left = this.left+'px';
    }
}