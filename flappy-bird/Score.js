function Score(width, height, parentClass) {
    this.locaStorage = window.localStorage;

    this.highScore = 0;

    this.width = width;
    this.height = height;

    this.top = 20;
    this.left = parentClass.width / 2;

    this.zIndex = 20;

    this.score = 0;

   

    this.scoreElement;
    this.scoreDisplayElement;

    this.init = function() {
        this.scoreElement = document.createElement('div');

        this.scoreElement.style.position = 'absolute';
        this.scoreElement.style.top = this.top + 'px';
        this.scoreElement.style.left = this.left + 'px';

        this.scoreElement.style.zIndex = this.zIndex;

        this.scoreElement.innerHTML = this.score;
        this.scoreElement.style.color = '#f3f3f3';
        this.scoreElement.style.fontSize = '36px';

        return this.scoreElement;
    }

    this.getHighScore = function() {
        this.highScore = parseInt(localStorage.getItem('flappyBirdHighScore'));
    }

    this.setHighScore = function() {
        this.getHighScore();
        if (!this.highScore) {
            this.highScore = 0;
        }
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
        this.store();
    }

    this.store = function() {
        localStorage.setItem('flappyBirdHighScore', this.highScore);
    }

    this.scored = function() {
        
        this.score += 5;
        this.draw();
    }

    this.draw = function() {
        this.scoreElement.innerHTML = this.score;
    }
}