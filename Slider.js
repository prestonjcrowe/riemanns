// Currently, max n === length of points array
// should points array be standard length regardless of
// width? seems trivial, 1px per points offer enoguh accuacy
"use strict";

class Slider {
  constructor(x, y, length) {
    this.x = x;
    this.y = y;
    this.length = length;
    this.handleX = this.x - this.length / 2;
    this.sliderSize = 14;
    //this.sliderSize = length / 5;
  }

  draw() {
    stroke(255);
    strokeWeight(0.5);
    line(this.x - this.length / 2, this.y, this.x + this.length / 2, this.y);
    line(this.handleX, this.y - 7, this.handleX, this.y + 7);
    noFill();
    ellipse(this.handleX, this.y, this.sliderSize, this.sliderSize);
  }

  mouseOver() {
    return dist(this.handleX, this.y, mouseX, mouseY) <= this.sliderSize;
  }

  bound() {
    if (this.getPortion() > 1) {
      this.handleX = this.x + this.length / 2;
    } else if (this.getPortion() < 0) {
      this.handleX = this.x - this.length / 2;
    }
  }

  setPosition(x) {
    if (
      this.handleX <= this.x + this.length / 2 &&
      this.handleX >= this.x - this.length / 2
    ) {
      this.handleX = x;
    }
    this.bound();
  }

  setX(x) {
    this.x = x;
  }

  setY(y) {
    this.y = y;
  }

  setLength(length) {
    this.length = length;
  }

  getPortion() {
    return (this.handleX - (this.x - this.length / 2)) / this.length;
  }
}
