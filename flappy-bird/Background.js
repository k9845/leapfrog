function GameBackground(width, height, scaleFactor, parentClass) {
    this.width = scaleFactor * width;
    this.height = height;

    this.top = (parentClass.height - this.height);
    this.left = 0;

    this.zIndex = 100;

    this.moveIntervalId;
    this.intervalRepeatTime = 10;

    this.directionY = 1;

    this.MAX_LEFT = - (scaleFactor - 1) * parentClass.width;

    this.gameBackgroundElement;

    this.init = function() {
        this.gameBackgroundElement = document.createElement('div');

        this.gameBackgroundElement.id = 'game-background';

        this.gameBackgroundElement.style.position = 'absolute';

        this.gameBackgroundElement.style.height = this.height + 'px';
        this.gameBackgroundElement.style.width = this.width + 'px';

        this.gameBackgroundElement.style.zIndex = this.zIndex;

        this.gameBackgroundElement.style.backgroundImage = 'url(./images/ground.jpg)';
        this.gameBackgroundElement.style.backgroundPosition = 'left';
        this.gameBackgroundElement.style.backgroundRepeat = 'repeat-x';
        this.gameBackgroundElement.style.backgroundSize = 'contain';

        this.gameBackgroundElement.style.top = this.top +'px';
        this.gameBackgroundElement.style.left = this.left + 'px';

        this.move();

        return this.gameBackgroundElement;
    }

    this.move = function() {
        this.moveIntervalId = setInterval(function() {
            this.left -= this.directionY;
            this.left = this.left <= this.MAX_LEFT ? 0 : this.left;
            this.draw();
        }.bind(this),this.intervalRepeatTime);
    }

    this.draw = function() {
        this.gameBackgroundElement.style.left = this.left + 'px';
    }
}