'use strict'
// #1b1d1c B (27, 29, 28)

// #b0d68b g (176, 214, 139)
// #d56061 r (213, 96, 97)
// #ae89d5 p (174, 137, 213)
// #fda657 o (253, 166, 87)
// #63b1f0 b (99, 177 240)

// This class should do drawing in terms of pixels rather
// than real number values, i.e values should all be scaled to
// graph size.

// MOVE CONTROLS TO ON TOP OF GRAPH

class Graph {
    constructor(points, n, minX, maxX, minY, maxY) {
        // could be good to set constants for reused expressions,
        // i.e. yAxis and xAxis and yScale / xScale (this.maxY/this.yRange)
        // would be good to include padding in these constants as well
        
        this.points = [];
        this.unscaledPoints = points;
        this.n = n;                     // could be 0, updates when setN?
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;

    	this.xRange = (minX + maxX);
    	this.yRange = (minY + maxY);

        this.yAxisRatio = this.maxY / this.yRange;
        this.showGrid = true;

        this.padding = 15;
        this.controlPanelHeight = height * .03;

        this.sideBarSize = width * 0.20;
        this.graphWidth = width - this.padding * 2;
        this.graphHeight = height - this.padding * 2;
        this.yScale = (this.graphHeight)/ this.yRange;

        this.dx = this.graphWidth / this.n;    // could be 0, updates when setN?
        this.scalePoints();
        this.pixelConversion = this.points.length / this.graphWidth;
        // if there is a seperate UI class, this.slider should be created there
        this.slider = new Slider(this.sideBarSize/2, height * 0.35, this.sideBarSize * 0.7);
        this.sums = new Sums(this.n, this.unscaledPoints, this.xRange);
    }

    setN(n) {
        this.n = n;
        this.sums.setN(n);
        this.dx = this.graphWidth / this.n;
    }

    scalePoints() {
        this.points = this.unscaledPoints.map(function (pt) {
            return  height * this.yAxisRatio - (pt * this.yScale);
        }.bind(this));
    }

    drawAxes(ticks) {
    	stroke(255);
        noFill();
        // Graph border
        rect(this.padding, this.padding,
            this.graphWidth, height - 2 * this.padding);
        
        // X axis 
        line(this.padding, height * this.yAxisRatio,
            this.graphWidth + this.padding, height * this.yAxisRatio);
        
        // Y axis 
        line(width - this.padding - (this.graphWidth * (this.maxX / this.xRange)),
            this.padding,
            width - this.padding - (this.graphWidth * (this.maxX / this.xRange)),
            height - this.padding);

        for(var i = 0; i < ticks; i++) {
            // option to show grid lines, default to ticks
            // if ticks == 0 or none is passed, no ticks
            // also need option to show incrs of PI
            stroke(127, 127);
            strokeWeight(0.5)
            if (this.showGrid) {
                line(this.padding + (this.graphWidth / ticks) * i, this.padding,
                     this.padding + (this.graphWidth / ticks) * i, height - this.padding);
                line(this.padding, this.padding + this.graphHeight - i * (this.graphHeight / ticks),
                    width - this.padding, this.padding + this.graphHeight - i * (this.graphHeight / ticks));
            }
            textSize(8);
            //noStroke();
            stroke(27, 29, 28);
            strokeWeight(2);
            fill(255);

            // X axis 
                text(this.roundTo(-this.minX + (i * (this.xRange / ticks)), 3), 
                this.padding + (this.graphWidth / ticks) * i,
                height * this.yAxisRatio - 5);

            // Y axis 
            text(this.roundTo(-this.minY + (i * (this.yRange / ticks)), 3), 
                width - this.padding - this.graphWidth * (this.maxX / this.xRange) + 5,
                this.padding + this.graphHeight - i * (this.graphHeight / ticks));
        }
    }

    drawCurve() {
        fill(255);
        strokeWeight(0.5);
        var index = 0;
        for (var i = 0; i < this.graphWidth - 1; i++) {
            stroke(255);
            index = Math.round(i * this.pixelConversion);
            line(i + this.padding,
                this.points[index],
                i + this.padding + 1,
                this.points[index +  Math.round(this.pixelConversion)]);
        }
    }

    roundTo(n, dec) {
        var factor = pow(10, dec);
        return Math.round(n * factor) / factor;
    }

    drawTrapezoid() {
        fill(213, 96, 97, 127);
        var scaledHeight = 0;
        var index = 0;
        var nextIndex = 0;
        for (var i = 0; i < this.n; i++) {
            index = Math.round(i * this.dx * this.pixelConversion);
            nextIndex = Math.round((i + 1) * this.dx * this.pixelConversion) - 1;

            quad(this.padding + (i + 1) * this.dx, this.points[nextIndex],
                this.padding + i * this.dx, this.points[index],
                this.padding + i * this.dx, height * this.yAxisRatio,
                this.padding + (i + 1) * this.dx, height * this.yAxisRatio); // :c
        }
    }

    drawLH() {
        fill(174, 137, 213, 127);
        var scaledHeight = 0;
        var index = 0;
        for (var i = 0; i < this.n; i++) {
            index = Math.round(i * this.dx * this.pixelConversion);
            scaledHeight = this.unscaledPoints[index] * this.yScale;
            rect(this.padding + i * this.dx, this.points[index],
                 this.dx, scaledHeight);
        }
    }

    drawRH() {
        fill(99, 177, 240, 127);
        var scaledHeight = 0;
        var index = 0;
        for (var i = 1; i < this.n + 1; i++) {
            index = Math.round(i * this.dx * this.pixelConversion);
            scaledHeight = this.unscaledPoints[index - 1] * this.yScale;
            rect(this.padding + i * this.dx, this.points[index - 1],
                 -this.dx, scaledHeight);
        }
    }

    // likely deserves it's own class eventually
    drawSidebar() {
        textSize(width/63);
        fill(255);
        stroke(255);
        strokeWeight(0);
        text("actual: " + this.roundTo(this.sums.actual(), 5), 20, 30);
        fill(176, 214, 139);
        stroke(176, 214, 139);
        // Active sums should be highlighted green
        text("LH: " + this.roundTo(this.sums.leftHand(), 5), 20, 60);
        text("RH: " + this.roundTo(this.sums.rightHand(), 5), 20, 90);
        text("T: " + this.roundTo(this.sums.trapezoid(), 5), 20, 120);
        fill(255);
        stroke(255);
        text("n: " + this.n, 20, 150);
        this.slider.draw();
    }

    noSubRect(x, y, w, h) {
        rect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h));
    }
}
