//global variables
var cols = 20;
var rows = 20;
var grid = new Array(cols);
var openSet = [];
var closedSet = [];
var start;
var end;
var w, h;
var canvasWidth = 600;
var canvasHeight = 600;
var path = [];
// to remove an element from an array
function includes(arr, elem) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == elem) {
      return true;
    }
  }
  return false;
}

function removeFromArray(array, elem) {
  for (var i = array.length - 1; i >= 0; i--) {
    if (array[i] == elem) {
      array.splice(i, 1);
    }
  }
}
// to calculate the distance between two points
function heuristic(a, b) {
  var d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}
//to create the spot
function Spot(i, j) {
  // some variables
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  if (random(1) < 0.2) {
    this.wall = true;
  }
  //to show the spot gets a color as the parameter
  this.show = function(col) {
      rect(this.i * w, this.j * h, w - 1, h - 1);
      fill(col);
      if (this.wall) {
        fill(0);
      }
      noStroke();
    }
    //setting the neighbors
  this.addNeighbors = function(grid) {
    var i = this.i;
    var j = this.j;
    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j])
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j])
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1])
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1])
    }
    for (var i = 0; i < this.neighbors.length; i++) {
      if (this.neighbors[i].wall === true) {
        this.neighbors.splice(i, 1);
      }
    }
  }
}

function setup() {
  w = canvasWidth / cols;
  h = canvasHeight / rows;
  createCanvas(canvasWidth, canvasHeight);
  console.log("A*");
  //creating the array grid
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  //creating the spots
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }
  //adding the neighbors
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }
  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  openSet.push(start);
}

function draw() {
  if (openSet.length > 0) {
    //keep going
    //lowest index
    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }
    //determining the least index
    var current = openSet[winner];

    if (openSet[winner] === end) {
      //DONE!!!
      console.log("DONE!");
      path = [];
      var temp = current;
      for (var i = 0; i < path.length; i++) {
        path[i].show(color(0, 0, 255));
      }
      noLoop();
    }
    removeFromArray(openSet, current);
    closedSet.push(current);

    var neighbors = current.neighbors;
    for (i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];
      if (!includes(closedSet, neighbor) && !neighbor.wall) {
        var tempG = current.g + 1;

        if (includes(openSet, neighbor)) {
          if (tempG <= neighbor.g) {
            neighbor.g = tempG;
          }
        } else {
          neighbor.g = tempG;
          openSet.push(neighbor);
        }
        //calculating the distance
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previous = current;
      }
    }
  } else {
    // no solution
    noLoop();
    console.log("no solution");
  }

  background(0);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }
  for (var i = 0; i < openSet.length; i++) {
    if (!openSet[i].wall) {
      openSet[i].show(color(0, 255, 0));

    }
  }
  for (var i = 0; i < closedSet.length; i++) {
    if (!closedSet[i].wall) {
      closedSet[i].show(color(255, 0, 0));

    }
  }

  //find the path
  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }
  for (var i = 0; i < path.length; i++) {
    path[i].show(color(0, 0, 255));
    end.show(color(0, 0, 255));
  }

}