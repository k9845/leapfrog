class Canvas {
  canvasElement;
  canvasContext;


 

  MIN_CIRCLE_RADIUS = 1;
  MAX_CIRCLE_RADIUS = 5;
  rows = 15;
  cols = 15;
  strand = 2;
  frameCount = 0;
  phase = 0;

  ROTATE_POINT = 7;

  CIRCLE_FLICKER_RATE = 0.1;

  STRAND_ROTATE_SPACE = 50;

  helixFrom = 3.5;  

  offSetX = 30;

  SPEED_OF_ROTATION = 0.05;


  constructor(height, width, parentClass) {
      this.height = height;
      this.width = width;
  }

  init() {
      this.canvasElement = document.createElement('canvas');
      this.canvasContext = this.canvasElement.getContext('2d');

      this.canvasElement.height = this.height;
      this.canvasElement.width = this.width;

      this.canvasElement.style.background = '#3F6634';

      this.canvasElement.style.margin = '0 auto';
      this.canvasElement.style.marginLeft ='200px';
      this.canvasElement.style.paddingLeft ='150px';

      this.initHelix();

      return this.canvasElement;
  }

  initHelix() {
      setInterval(function() {
          this.canvasContext.clearRect(0, 0, this.width, this.height);

          let X = 0;
          let Y = 0;
          let columnOffset = 0;
          this.frameCount++;
          
          this.phase = this.frameCount * this.SPEED_OF_ROTATION;

          for(let Count = 0; Count < this.strand; Count++) {
              if (Count === 0) {
                  var strandPhase = this.phase;
              } else {
                  var strandPhase = this.phase + Count * Math.PI;
              }
              X = 0;
              for(let col = 0; col < this.cols; col++) {
                  X += this.offSetX;
                  columnOffset = (col * this.strand) / this.ROTATE_POINT;

                  for(let row = 0; row < this.rows; row++) {
                      Y = this.height / this.helixFrom + row * this.rows + Math.sin(strandPhase + columnOffset) * this.STRAND_ROTATE_SPACE;
                      let sizeOffset = (Math.cos(strandPhase -(row * this.CIRCLE_FLICKER_RATE) + columnOffset) + this.MIN_CIRCLE_RADIUS);
                      let circleRadius = sizeOffset * this.MAX_CIRCLE_RADIUS;

                      this.canvasContext.beginPath();
                      this.canvasContext.arc(X, Y, circleRadius, 0,  2 * Math.PI);
                      
                      this.canvasContext.fillStyle='purple';
                      this.canvasContext.fill();
                      this.canvasContext.closePath();
                  }
              }
          }
      }.bind(this),20);
      
  }

}