"use strict";
// #1b1d1c B (27, 29, 28)

// #b0d68b g (176, 214, 139)
// #d56061 r (213, 96, 97)
// #ae89d5 p (174, 137, 213)
// #fda657 o (253, 166, 87)
// #63b1f0 b (99, 177 240)

// This class should do drawing in terms of pixels rather
// than real number values, i.e values should all be scaled to
// graph size.

// Maybe draw points and lines? could help abate missing line segments
class Graph {
  constructor(points, n, minX, maxX, minY, maxY, maxN) {
    // could be good to set constants for reused expressions,
    // i.e. yAxis and xAxis and yScale / xScale (this.maxY/this.range)
    // would be good to include padding in these constants as well

    this.points = [];
    this.unscaledPoints = points;
    this.n = n;
    this.maxN = maxN;
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.domain = this.maxX - this.minX;
    this.range = this.maxY - this.minY;

    this.yAxisRatio = this.maxY / this.range;
    this.xAxisRatio = this.maxX / this.domain;
    this.showGrid = true;

    this.padding = 30;
    this.buttons = [];

    // this block is replicated in resize()
    this.graphWidth = width - this.padding * 2;
    this.graphHeight = height - this.padding * 2;
    this.yScale = this.graphHeight / this.range;
    this.controlPanelHeight = height * 0.03;

    this.dx = this.graphWidth / this.n;
    this.scalePoints();
    this.createButtons();
    this.pixelConversion = this.points.length / this.graphWidth;

    // if there is a seperate UI class, this.slider should be created there
    var sliderLength = this.graphWidth / 5;
    this.slider = new Slider(
      width - this.padding - sliderLength / 2,
      this.padding / 2,
      sliderLength
    );
    this.sums = new Sums(this.n, this.unscaledPoints, this.domain);
  }

  setN(n) {
    this.n = n;
    this.sums.setN(n);
    this.dx = this.graphWidth / this.n;
  }

  scalePoints() {
    this.points = this.unscaledPoints.map(
      function(pt) {
        return (
          this.padding + this.graphHeight * this.yAxisRatio - pt * this.yScale
        );
      }.bind(this)
    );
  }

  drawGrid(ticks) {
    if (this.showGrid) {
      for (var i = 0; i < ticks; i++) {
        stroke(127, 127);
        strokeWeight(0.5);
        line(
          this.padding + (this.graphWidth / ticks) * i,
          this.padding,
          this.padding + (this.graphWidth / ticks) * i,
          height - this.padding
        );
        line(
          this.padding,
          this.padding + this.graphHeight - i * (this.graphHeight / ticks),
          width - this.padding,
          this.padding + this.graphHeight - i * (this.graphHeight / ticks)
        );
      }
    }
  }

  drawAxes(ticks) {
    stroke(255);
    noFill();
    var xAxisVisible =
      this.yAxisRatio >= 1 || this.yAxisRatio <= 0 ? false : true;
    var yAxisVisible =
      this.xAxisRatio >= 1 || this.xAxisRatio <= 0 ? false : true;

    // Graph border
    rect(
      this.padding,
      this.padding,
      this.graphWidth,
      height - 2 * this.padding
    );

    // X axis
    if (xAxisVisible) {
      line(
        this.padding,
        this.graphHeight * this.yAxisRatio + this.padding,
        width - this.padding,
        this.graphHeight * this.yAxisRatio + this.padding
      );
    }

    // Y axis
    if (yAxisVisible) {
      line(
        width - this.padding - this.graphWidth * (this.maxX / this.domain),
        this.padding,
        width - this.padding - this.graphWidth * (this.maxX / this.domain),
        height - this.padding
      );
    }

    for (var i = 0; i < ticks; i++) {
      // need option to show incrs of PI (?)
      var fontSize = Math.round(this.graphWidth / ticks / 5);
      var maxSize = Math.round(0.015 * this.graphWidth);
      fontSize = fontSize > maxSize ? maxSize : fontSize;
      textSize(fontSize);
      stroke(27, 29, 28);
      strokeWeight(2);
      fill(255, 200);

      // X axis
      if (!xAxisVisible) {
        text(
          this.roundTo(this.minX + i * (this.domain / ticks), 3),
          this.padding + (this.graphWidth / ticks) * i,
          this.padding + this.graphHeight + fontSize
        );
      } else {
        text(
          this.roundTo(this.minX + i * (this.domain / ticks), 3),
          this.padding + (this.graphWidth / ticks) * i,
          this.padding + this.graphHeight * this.yAxisRatio + fontSize
        );
      }

      // Y axis
      if (!yAxisVisible) {
        text(
          this.roundTo(this.minY + i * (this.range / ticks), 3),
          this.padding,
          this.padding + this.graphHeight - i * (this.graphHeight / ticks)
        );
      } else {
        text(
          this.roundTo(this.minY + i * (this.range / ticks), 3),
          width - this.padding - this.graphWidth * (this.maxX / this.domain),
          this.padding + this.graphHeight - i * (this.graphHeight / ticks)
        );
      }
    }
  }

  drawCurve() {
    fill(255);
    strokeWeight(0.5);
    var index = 0;
    for (var i = 0; i < this.graphWidth - 1; i++) {
      stroke(255);
      index = Math.round(i * this.pixelConversion);
      line(
        i + this.padding,
        this.points[index],
        i + this.padding + 1,
        this.points[index + Math.round(this.pixelConversion)]
      );
    }
  }

  roundTo(n, dec) {
    var factor = pow(10, dec);
    return Math.round(n * factor) / factor;
  }

  drawTrapezoid() {
    fill(213, 96, 97, 100);
    var scaledHeight = 0;
    var index = 0;
    var nextIndex = 0;
    for (var i = 0; i < this.n; i++) {
      index = Math.round(i * this.dx * this.pixelConversion);
      nextIndex = Math.round((i + 1) * this.dx * this.pixelConversion) - 1;

      quad(
        this.padding + (i + 1) * this.dx,
        this.points[nextIndex],
        this.padding + i * this.dx,
        this.points[index],
        this.padding + i * this.dx,
        this.graphHeight * this.yAxisRatio + this.padding,
        this.padding + (i + 1) * this.dx,
        this.graphHeight * this.yAxisRatio + this.padding
      ); // :c
    }
  }

  drawLH() {
    fill(174, 137, 213, 100);
    var scaledHeight = 0;
    var index = 0;
    for (var i = 0; i < this.n; i++) {
      index = Math.round(i * this.dx * this.pixelConversion);
      scaledHeight = this.unscaledPoints[index] * this.yScale;
      rect(
        this.padding + i * this.dx,
        this.points[index],
        this.dx,
        scaledHeight
      );
    }
  }

  drawMidpoint() {
    // need a prettier color here...
    fill(253, 166, 87, 100);
    var scaledHeight = 0;
    var index = 0;
    for (var i = 0; i < this.n; i++) {
      index = Math.round(i * this.dx * this.pixelConversion);
      index += Math.round((this.dx * this.pixelConversion) / 2);
      scaledHeight = this.unscaledPoints[index] * this.yScale;
      rect(
        this.padding + i * this.dx,
        this.points[index],
        this.dx,
        scaledHeight
      );
    }
  }

  drawRH() {
    fill(99, 177, 240, 100);
    var scaledHeight = 0;
    var index = 0;
    for (var i = 1; i < this.n + 1; i++) {
      index = Math.round(i * this.dx * this.pixelConversion);
      scaledHeight = this.unscaledPoints[index - 1] * this.yScale;
      rect(
        this.padding + i * this.dx,
        this.points[index - 1],
        -this.dx,
        scaledHeight
      );
    }
  }

  createButtons() {
    var spacing = this.graphWidth / 6;
    var actual = new Button(
      this.padding,
      this.padding / 1.5,
      "actual: ",
      () => {
        return this.roundTo(this.sums.actual(), 5);
      }
    );

    var leftHand = new Button(
      this.padding + 1 * spacing,
      this.padding / 1.5,
      "LH: ",
      () => {
        return this.roundTo(this.sums.leftHand(), 9);
      },
      true
    );

    var rightHand = new Button(
      this.padding + 2 * spacing,
      this.padding / 1.5,
      "RH: ",
      () => {
        return this.roundTo(this.sums.rightHand(), 9);
      },
      true
    );

    var trapezoid = new Button(
      this.padding + 3 * spacing,
      this.padding / 1.5,
      "T: ",
      () => {
        return this.roundTo(this.sums.trapezoid(), 9);
      },
      true
    );

    var n = new Button(
      this.padding + 4 * spacing,
      this.padding / 1.5,
      "n: ",
      () => {
        return this.n;
      }
    );

    this.buttons = [actual, leftHand, rightHand, trapezoid, n];
  }

  drawButtons() {
    this.buttons.forEach(function(button) {
      button.draw();
    });
  }

  drawActiveSums() {
    var self = this;
    this.buttons.forEach(function(button) {
      if (button.active) {
        switch (button.text) {
          case "LH: ":
            self.drawLH();
            break;
          case "RH: ":
            self.drawRH();
            break;
          case "T: ":
            self.drawTrapezoid();
            break;
          default:
            break;
        }
      }
    });
  }

  // Accepts a signed array of values,
  // -x, +x, -y, +y,
  // errors when invalid bounds
  setBounds(bounds) {
    this.minX = bounds[0];
    this.maxX = bounds[1];
    this.minY = bounds[2];
    this.maxY = bounds[3];
    this.domain = this.maxX - this.minX;
    this.range = this.maxY - this.minY;

    this.yAxisRatio = this.maxY / this.range;
    this.xAxisRatio = this.maxX / this.domain;
    this.yScale = this.graphHeight / this.range;

    // can just set domain instead of creating new sums object (?)
    // need new points for sure
    this.sums = new Sums(this.n, this.unscaledPoints, this.domain);
    this.scalePoints();
  }

  getButtons() {
    return this.buttons;
  }

  getBounds() {
    return this.minX + " " + this.maxX + " " + this.minY + " " + this.maxY;
  }

  setPoints(newPoints) {
    this.unscaledPoints = newPoints;
    this.scalePoints();
    this.sums = new Sums(this.n, this.unscaledPoints, this.domain);
  }

  setMaxN(max) {
    this.maxN = max;
    if (this.maxN < this.n) {
      this.setN(this.maxN);
    }
    this.resize();
  }

  // shoud be called drawUIElements
  drawTopBar() {
    // also redraws area above and below graph to cover any sums drawn
    // outside of the graph view... hacky....
    fill(27, 29, 28);
    noStroke();
    rect(0, 0, width, this.padding);
    rect(0, height - this.padding, width, this.padding);
    this.drawButtons();
    this.slider.draw();
  }

  drawActiveFunction(functionString) {
    noStroke();
    rectMode(CENTER);
    textAlign(CENTER);
    textSize(this.padding / 2);
    fill(27, 29, 28, 200);
    rect(
      width / 2,
      height - this.padding / 2.1,
      textWidth("f(x) = " + functionString),
      this.padding,
      5
    );
    fill(213, 96, 97);
    text("f(x) = " + functionString, width / 2, height - this.padding / 3);
    textAlign(LEFT);
    rectMode(CORNER);
  }

  resize() {
    this.controlPanelHeight = height * 0.03;
    this.graphWidth = width - this.padding * 2;
    this.graphHeight = height - this.padding * 2;
    this.yScale = this.graphHeight / this.range;
    this.dx = this.graphWidth / this.n;
    this.scalePoints();
    this.createButtons();
    this.pixelConversion = this.points.length / this.graphWidth;

    var sliderLength = this.graphWidth / 5;
    var newX = width - this.padding - sliderLength / 2;
    this.slider.setLength(sliderLength);
    this.slider.setX(newX);
    this.slider.setY(this.padding / 2);
    this.slider.handleX =
      newX - sliderLength / 2 + (this.n / this.maxN) * sliderLength;
  }

  noSubRect(x, y, w, h) {
    rect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h));
  }
}
