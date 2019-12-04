'use strict';

class Container {
    ContainerElement;

    canvasHeight = 500;
    canvasWidth = 550;

    canvasClass;

    constructor(parentElement) {

    }

    init() {
        this.ContainerElement = document.createElement('div');

        this.ContainerElement.style.margin = '20px auto';

        this.ContainerElement.style.float = 'left';
        this.initCanvas();

        return this.ContainerElement;
    }

    initCanvas() {
        this.canvasClass = new Canvas(this.canvasHeight, this.canvasWidth, this);
        this.ContainerElement.appendChild(this.canvasClass.init());
    }
}