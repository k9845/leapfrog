function EndScreen(width, parentClass) {
    this.width = width;

    this.zIndex = 160;

    this.endScreenElement;

    this.init = function() {
        this.endScreenElement = document.createElement('div');

        this.endScreenElement.style.background = '#ffffff00';

        this.endScreenElement.style.width = this.width + 'px';

        this.endScreenElement.style.position = 'absolute';
        this.endScreenElement.style.bottom = '0px';
    
        


        this.endScreenElement.style.zIndex = this.zIndex;

        this.endScreenElement.style.color = 'red';
        this.endScreenElement.style.textAlign = 'center';

        this.endScreenElement.innerHTML = 'RESTART';

        var score = document.createElement('span');
        score.style.lineHeight = '50px';
        score.style.display = 'block';
        score.innerHTML = 'Score : ' + parentClass.scoreClass.score;
        this.endScreenElement.appendChild(score);

        var highScore = document.createElement('span');
        highScore.style.lineHeight = '50px';
        highScore.display = 'block';
        highScore.innerHTML = 'High Score:' + parentClass.scoreClass.highScore;
        this.endScreenElement.appendChild(highScore);

        this.endScreenElement.onmouseover = function() {
            this.endScreenElement.style.cursor = 'pointer';
        }.bind(this);

        this.endScreenElement.onclick = function() {
            parentClass.restartGame();
            parentClass.gameContainerElement.removeChild(this);
        }

        return this.endScreenElement;
    }
}