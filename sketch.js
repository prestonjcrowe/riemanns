var graph,
  sums,
  testPoints,
  promptActive = false,
  menuActive = false,
  mouseHeld = false,
  promptCb, // this will be elinated by activePromp object
  activePrompt = {},
  menuButtonX,
  menuButtonY,
  functionString = "sin(x)",
  activeFunction = math.eval("f(x) = " + functionString);

const ACCURACY = 10000; // number of points computed
const INIT_DOMAIN = 2 * Math.PI;

var ticks = 20;
var maxN = 100; // max value of the n slider
var menuEntries = [];

// can check for mouse movement, highlight menu entry and redraw without
// redrawing on each mouse mouse
// mouseMoved () { if (menuActive) {}}...

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(27, 29, 28);
  populatePoints(0, INIT_DOMAIN);
  graph = new Graph(testPoints, 0, 0, INIT_DOMAIN, -1, 1, maxN);
  menuButtonX = width - graph.padding / 2;
  menuButtonY = height - 5 - graph.padding / 2;
  menuEntries = [
    {
      name: "f(x)",
      cb: setFunction
    },
    {
      name: "bounds",
      cb: setBounds
    },
    {
      name: "ticks",
      cb: setTicks
    },
    // this should be increase font size or something? not sure
    // if this should change all font sizes, could potentially
    // cause issues with sum value display accuracy... will
    // revsit
    // {
    //     name: 'tick size',
    //     cb: setTickSize
    // },
    {
      name: "max n",
      cb: setMaxN
    }
  ];
}

function draw() {
  noLoop();
  noSmooth();
  background(27, 29, 28);
  graph.drawGrid(ticks);
  graph.drawCurve();
  graph.drawActiveSums();
  graph.drawTopBar();
  graph.drawAxes(ticks);
  graph.drawActiveFunction(functionString);
  drawMenuIcon(menuButtonX, menuButtonY);
  if (menuActive) {
    drawMenu();
  }
  //drawPrompt(function() {console.log('hey')});
}

// This can also check if there are any undefined points in the
// domain, not sure if I want to implement this without some
// kind of notification system in place, could confuse users
function isLegalFunc(min, domain, func) {
  var x;

  try {
    for (var i = 0; i <= ACCURACY; i++) {
      x = min + domain * (i / ACCURACY);
      // check if defined everywher on the domain
      // if (!func(x)) return false;
      func(x);
    }
  } catch (e) {
    return false;
  }
  return true;
}

function populatePoints(min, domain) {
  var x;
  testPoints = [];

  for (var i = 0; i <= ACCURACY; i++) {
    x = min + domain * (i / ACCURACY);
    testPoints.push(activeFunction(x));
  }
}

// pass a callback function, fires on enter...
// also pass a validation function? mayb not, will see later
function drawPrompt(cb) {
  var value = "this is a test prompt with a very long input";
  var display = value;
  var pWidth = width / 4;
  var pHeight = pWidth / 5;
  var chop = 0;
  promptCb = cb;
  if (promptActive) {
    textSize(pHeight / 2);
    while (textWidth(display) > pWidth) {
      chop++;
      display = value.substr(chop);
    }

    rectMode(CENTER);
    fill(255);
    rect(width / 2, height / 2, pWidth, pHeight);
    rectMode(CORNER);
    fill(0);
    text(display, width / 2 - pWidth / 2, height / 2 + pHeight * 0.25);
  }
}

function newPrompt(cb, init) {
  // return {'cb': cb, 'init': init}
}

function drawMenu() {
  // these can be attrs of menuEntries?
  var entryHeight = height / 20;
  var w = width / 4;
  var h = entryHeight * menuEntries.length;
  var entryId = 0;
  fill(27, 29, 28, 200);
  rectMode(CENTER);
  noStroke();
  rect(width / 2, height / 2, w, h);
  textSize(entryHeight / 2);
  menuEntries.forEach(function(entry) {
    noFill();
    stroke(255);
    strokeWeight(1);
    rect(
      width / 2,
      height / 2 - h / 2 + entryHeight / 2 + entryHeight * entryId,
      w,
      entryHeight
    );
    fill(255);
    noStroke();
    let textX = width / 2 - w / 2 + w / 2 - textWidth(entry.name) / 2;
    let textY = height / 2 - h / 2 + entryHeight / 2 + entryHeight * entryId;
    text(entry.name, textX, textY);
    entryId++;
  });

  stroke(255);
  rectMode(CORNER);
}

function validBounds(bounds) {
  return bounds[0] < bounds[1] && bounds[2] < bounds[3];
}

function setBounds() {
  var input = prompt(
    "Enter -x, +x, -y, and +y bounds separated by spaces: ",
    graph.getBounds()
  );
  var bounds = input.split(" ");
  for (var i = 0; i < 4; i++) {
    if (bounds[i] && isNaN(bounds[i])) {
      bounds[i] = bounds[i].toLowerCase();
      if (bounds[i].includes("e")) {
        bounds[i] = bounds[i].replace("e", Math.E);
        // if Xe, replace with "*Math.E"
      }
      if (bounds[i].includes("pi")) {
        bounds[i] = bounds[i].replace("pi", Math.PI);
        // if Xpi, replace with "*Math.PI"
      }
      bounds[i] = math.eval(bounds[i]);
      if (isNaN(bounds[i])) {
        return;
      }
    }
  }

  bounds = bounds.map(function(bound) {
    return parseFloat(bound);
  });
  if (validBounds(bounds)) {
    populatePoints(bounds[0], bounds[1] - bounds[0]);
    graph.setPoints(testPoints);
    graph.setBounds(bounds);
    redraw();
    return true;
  } else {
    console.log("Invalid bounds ya dingus!");
    return false;
  }
}

function setFunction() {
  var userInput = prompt("Enter new f(x): ", functionString);
  if (userInput !== null) {
    var func = math.eval("f(x) = " + userInput);
    if (isLegalFunc(graph.minX, graph.domain, func)) {
      functionString = userInput;
      activeFunction = func;
      populatePoints(graph.minX, graph.domain);
      graph.setPoints(testPoints);
      redraw();
      return true;
    }
    return false;
  }
  return false;
}

function setTicks() {
  var userInput = parseInt(prompt("Enter # ticks: ", ticks));
  if (!isNaN(userInput)) {
    ticks = userInput <= 100 ? userInput : 100;
    return true;
  }
  return false;
}

function setTickSize() {}

function setMaxN() {
  var max = parseInt(prompt("Enter max n: ", graph.maxN));
  if (!isNaN(max)) {
    max = max > 10000 ? 10000 : max;
    maxN = max;
    graph.setMaxN(max);
    redraw();
    return true;
  }
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  graph.resize();
  menuButtonX = width - graph.padding / 2;
  menuButtonY = height - 5 - graph.padding / 2;
  redraw();
}

function drawMenuIcon(x, y) {
  var dotSize = graph.padding / 6;
  var iconSize = graph.padding - 5;
  fill(255, 100);
  noStroke();
  ellipse(x, y - iconSize / 3, dotSize, dotSize);
  ellipse(x, y, dotSize, dotSize);
  ellipse(x, y + iconSize / 3, dotSize, dotSize);
  stroke(255);
}

function mousePressed() {
  if (graph.slider.mouseOver()) {
    mouseHeld = true;
  }
  if (menuActive) {
    var entryHeight = height / 20;
    var w = width / 4;
    var h = entryHeight * Object.keys(menuEntries).length;
    menuEntries.forEach(function(entry, index) {
      if (
        mouseX > width / 2 - w / 2 &&
        mouseX < width / 2 + w / 2 &&
        mouseY < height / 2 - h / 2 + entryHeight * (index + 1) &&
        mouseY > height / 2 - h / 2 + entryHeight * index
      ) {
        var success = entry.cb();
        if (success === true || success === undefined) {
          menuActive = false;
          redraw();
        }
      }
    });
  }
  if (dist(mouseX, mouseY, menuButtonX, menuButtonY) < graph.padding - 20) {
    menuActive = !menuActive;
    redraw();
  }
  graph.getButtons().forEach(function(button) {
    if (button.mouseOver()) {
      button.toggle();
      redraw();
    }
  });
}

function mouseReleased() {
  if (mouseHeld) {
    mouseHeld = false;
  }
}

function mouseDragged() {
  if (mouseHeld) {
    graph.slider.setPosition(mouseX);
    graph.setN(Math.round(graph.slider.getPortion() * maxN));
    redraw();
  }
}

function keyPressed() {
  if (key === " ") {
    menuActive = !menuActive;
    redraw();
  } else if (keyCode === 27 && menuActive) {
    menuActive = false;
    redraw();
  }
  // else if (keyCode === 13 && promptActive) {
  //     if (promptCb) {
  //         promptCb();
  //     }
  // }
}

// activePrompt, {cb, initialValue, [valid f(x)]}
// newPrompt(cb, init) returns an object
// to check if prompt is active, if (activePromt)
// set undefined in cb
// on Enter, activePrompt.cb()
