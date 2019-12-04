function Bird(height, width, parentClass) {
    this.height = height;
    this.width = width;

    this.top = (parentClass.height - this.height) / 2;
    this.left = (parentClass.width - this.width) / 2;

    

    this.birdMoveOffset = 80;
    this.birdAnimationSpeed = 4;

    this.moveRotateAngle = -35;

    this.gravityEffectIntervalId;
    this.dropByGravity = 0.01;
    this.dropIncreaseBy = 0.09;
    this.MAX_DROP_RATE = 
    this.gravityEffectIntervalTime = 10;

    this.zIndex = 20;

    this.animateId; 

    this.birdElement;
    this.imageContainer;

    this.init = function() {
        this.birdElement = document.createElement('div');

        this.birdElement.style.position = 'absolute';

        this.birdElement.id = 'bird';

        this.birdElement.style.top = this.top+'px';
        this.birdElement.style.left = this.left +'px';

        this.birdElement.style.zIndex = this.zIndex;

        this.birdElement.style.height = this.height +'px';
        this.birdElement.style.width = this.width +'px';

        this.imageContainer = document.createElement('div');
        this.imageContainer.style.width = this.width + 'px';
        this.imageContainer.style.height = this.height + 'px';
        this.imageContainer.style.backgroundImage = 'url(./images/flappy_bird.png)';
        this.imageContainer.style.backgroundSize = '100% 100%';

        this.birdElement.appendChild(this.imageContainer);

        this.gravityEffect();

        return this.birdElement;
    }

    this.reset = function() {
        this.dropByGravity = 0.2;
        this.moveRotateAngle = -25;
        clearInterval(this.gravityEffectIntervalId);
    }

    this.stopAnyPriorMovement = function() {
        if (this.animateId) {
            clearInterval(this.animateId);
        }
    }

    this.move = function() {
        this.reset();
        this.imageContainer.style.backgroundImage = 'url(./images/flappy_bird.gif)';
        this.imageContainer.style.transform = 'rotate('+this.moveRotateAngle+'deg)';
        this.stopAnyPriorMovement();
        this.animateMoveTo(this.top - this.birdMoveOffset);
    }

    this.animateMoveTo = function(to) {
        this.animateId = setInterval(function() {
            if (this.top >= to) {
                this.top -= this.birdAnimationSpeed;
                if (this.top < 0) {
                   
                    parentClass.gameOver();
                }
                this.draw();
            } else {
                this.gravityEffect();
                clearInterval(this.animateId);
            }
        }.bind(this), 10);
    }

    this.fallToGround = function() {
        this.moveRotateAngle = 90;
        this.imageContainer.style.transform = 'rotate('+this.moveRotateAngle+'deg)';
        this.imageContainer.style.backgroundImage = 'url(./images/flappy_bird.png)';
        var id = setInterval(function() {
            
            if (this.top + this.height < parentClass.height - parentClass.gameBackgroundClass.height) {
                this.top += 4;
                this.draw();
            } else {
                clearInterval(id);
            }
        }.bind(this), 1);
    }

    this.gravityEffect = function() {
        this.gravityEffectIntervalId = setInterval(function() {
            if (parentClass.gameBackgroundClass.top < this.top + this.height) {
               
                parentClass.gameOver();
            }
            if (this.moveRotateAngle < 90) {
                if (this.moveRotateAngle > -10) {
                    this.imageContainer.style.backgroundImage = 'url(./images/flappy_bird.png)';
                }
                this.moveRotateAngle += 2;
                this.imageContainer.style.transform = 'rotate('+this.moveRotateAngle+'deg)';
            }
            this.dropByGravity = this.dropByGravity > this.MAX_DROP_RATE ? this.MAX_DROP_RATE : this.dropByGravity;
            this.top += this.dropByGravity;
            this.dropByGravity += this.dropIncreaseBy;
            this.draw();
        }.bind(this),this.gravityEffectIntervalTime);
    }

    this.draw = function() {
        this.birdElement.style.top = this.top+'px';
    }
}