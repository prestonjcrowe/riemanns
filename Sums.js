"use strict";

class Sums {
  constructor(n, points, domain) {
    this.n = n;
    this.points = points;
    this.domain = domain;
    this.dx = this.domain / n;
    this.pixelInterval = points.length / n;
  }

  leftHand() {
    if (this.n === 0) return 0;
    var sum = 0;
    for (var i = 0; i < this.n; i++) {
      sum += this.points[Math.round(i * this.pixelInterval)];
    }
    return sum * this.dx;
  }

  midpoint() {
    if (this.n === 0) return 0;
    var sum = 0;
    for (var i = 0; i < this.n; i++) {
      sum += this.points[
        Math.round(i * this.pixelInterval + this.pixelInterval / 2)
      ];
    }
    return sum * this.dx;
  }

  rightHand() {
    if (this.n === 0) return 0;
    var sum = 0;
    for (var i = 1; i <= this.n; i++) {
      sum += this.points[Math.round(i * this.pixelInterval) - 1];
    }
    return sum * this.dx;
  }

  trapezoid() {
    if (this.n === 0) return 0;
    var sum = 0;
    sum += this.points[0];
    sum += this.points[this.points.length - 1];
    for (var i = 1; i < this.n; i++) {
      sum += 2 * this.points[Math.round(i * this.pixelInterval)];
    }
    sum *= this.dx;
    sum *= 0.5;
    return sum;
  }

  actual() {
    var initValue = this.points[0] + this.points[this.points.length - 1];
    var dx = this.domain / this.points.length;
    return (
      (dx / 2) *
      this.points.reduce(function(sum, point) {
        return sum + 2 * point;
      }, initValue)
    );
  }

  setN(n) {
    this.n = n;
    this.dx = this.domain / n;
    this.pixelInterval = this.points.length / n;
  }
}
