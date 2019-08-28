// This is a button only applicable in MenuBar (along top of screen)
// Optional updateFunction is called on each redraw

class Button {
  constructor(x, y, text, updateFunction, clickable = false) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.updateFunction = updateFunction;
    this.active = true;
    this.clickable = clickable;
    this.textWidth;
    this.fontSize;
  }

  draw() {
    this.fontSize = width / 75;
    if (this.fontSize > this.padding / 2) {
      this.fontSize = this.padding / 2;
    } else if (this.fontSize < 8) {
      fontSize = 8;
    }
    textSize(this.fontSize);
    fill(255);
    stroke(255);
    strokeWeight(0);
    if (this.active && this.clickable) {
      fill(176, 214, 139);
    } else {
      fill(255);
    }
    if (this.updateFunction) {
      text(this.text + this.updateFunction(), this.x, this.y);
    } else {
      text(this.text, this.x, this.y);
    }
  }

  mouseOver() {
    var displayedText = this.text + this.updateFunction();
    this.textWidth = textWidth(displayedText);
    textSize(this.fontSize);

    if (
      mouseX - this.x < this.textWidth &&
      mouseX - this.x > 0 &&
      mouseY < this.y * 1.5
    ) {
      return true;
    }
    return false;
  }

  toggle() {
    this.active = !this.active;
  }
}
