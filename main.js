//----------------------------------------------------------------------
// Constants and utility functions
//----------------------------------------------------------------------

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

var collision_count;
var ball_count;
var time;
var points;

var counter_ball = document.querySelector("#ballid");
var counter_time = document.querySelector("#timeid");
var counter_points = document.querySelector("#pointsid");

// function to generate random number
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

//----------------------------------------------------------------------
// Shape class
//----------------------------------------------------------------------

class Shape {
  // constructor
  constructor(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

//----------------------------------------------------------------------
// Ball class
//----------------------------------------------------------------------

// Inheritance from Shape class
class Ball extends Shape {
  // constructor method (create the object)
  constructor(x, y, velX, velY, color, size) {
    /*
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    */
    // call Shape class constructor
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true;
  }

  // draw method
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    // arc
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  // update method
  update() {
    if (this.x + this.size >= width) {
      // reverse the polarity of the relevant velocity to make the ball travel in the opposite direction
      this.velX = -this.velX;
    }
    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }
    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }
    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }

    // add the velocity value to the ball coordinates
    this.x += this.velX;
    this.y += this.velY;
  }

  // method for collision detection
  collisionDetect() {
    // loop thru all balls
    for (const ball of balls) {
      // check only if this ball is not the looped ball
      if (!(this === ball) && ball.exists) {
        // check distance between the two balls
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // if distance is smaller than the two balls sizes then there is a collision
        if (distance < this.size + ball.size) {
          // randomly change the color of the ball
          ball.color = this.color = randomRGB();
          // collision count
          collision_count++;
          // balls eat each other
          // bigger ball wins
          if (this.size >= ball.size) {
            ball.exists = false;
            this.size += ball.size / 5;
          } else {
            this.exists = false;
            ball.size += this.size / 5;
          }
          ball_count -= 1;
          counter_ball.innerHTML = `Ball count: ${ball_count}`;
        }
      }
    }
  }
}

//----------------------------------------------------------------------
// Circle class
//----------------------------------------------------------------------

// Inheritance from Shape class
class Circle extends Shape {
  // constructor
  constructor(x, y) {
    // call Shape class constructor
    super(x, y, 10, 10);
    this.color = "white";
    this.size = 20;
    this.border = [false, false, false, false]; // top, right, bottom, left
    // implement the move logic via keydown events
    window.addEventListener("keydown", (e) => {
      console.log(e.key);
      this.checkBounds();
      switch (e.key) {
        case "ArrowLeft": // left
          console.log("move left");
          if (!this.border[3]) {
            this.x -= this.velX;
          }
          break;
        case "ArrowRight": // right
          console.log("move right");
          if (!this.border[1]) {
            this.x += this.velX;
          }
          break;
        case "ArrowUp": // up
          console.log("move up");
          if (!this.border[0]) {
            this.y -= this.velY;
          }
          break;
        case "ArrowDown": // down
          console.log("move down");
          if (!this.border[2]) {
            this.y += this.velY;
          }
          break;
      }
    });
  }

  // draw method
  draw() {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = this.color;
    // arc
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // checkBounds method
  checkBounds() {
    //console.log("checkBounds")
    for (let i = 0; i <= 3; i++) {
      this.border[i] = false;
    } // set all values to false
    //console.log(this.border)
    if (this.x + this.size >= width) {
      this.border[1] = true;
    }
    if (this.x - this.size <= 0) {
      this.border[3] = true;
    }
    if (this.y + this.size >= height) {
      this.border[2] = true;
    }
    if (this.y - this.size <= 0) {
      this.border[0] = true;
    }
  }

  // method for collision detection
  collisionDetect() {
    // loop thru all balls
    for (const ball of balls) {
      if (ball.exists) {
        // check distance between the two balls
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // if distance is smaller than the two balls sizes then there is a collision
        if (distance < this.size + ball.size) {
          ball.exists = false;
          points += points < 15 ? 2 : 1;
          ball_count -= 1;
          counter_ball.innerHTML = `Ball count: ${ball_count}`;
          counter_points.innerHTML = `Points: ${points}`;

          // collision count
          //collision_count++;
        }
      }
    }
  }
}

//----------------------------------------------------------------------
// Setup
//----------------------------------------------------------------------
// Array of balls
var balls;

var setup = function() {

balls = [];
collision_count = 0;
ball_count = 0;
time = 0;
points = 0;

while (balls.length < 25) {

  // random ball size
  const size = random(10, 20);

  // create a new ball
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-5, 5),
    random(-5, 5),
    randomRGB(), // random color
    size,
    true
  );

  // push ball to array
  balls.push(ball);
  
  ball_count += 1;
  counter_ball.innerHTML = `Ball count: ${ball_count}`;
}

}

setup();

// create circle object
var circle = new Circle(50, 50);

//----------------------------------------------------------------------
// Animation logic
//----------------------------------------------------------------------

// loop for animation
function loop() {

  counter_points.innerHTML = `Points: ${points}`;

  // new rectangle across the screen
  // cover up the previous frame drawing
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  // draw and update the balls
  for (let ball of balls) {
    if (ball.exists) {
      ball.draw();
      // collision detection method
      ball.collisionDetect();
      ball.update();
    }
  }

  // draw and update the circle
  circle.draw();
  circle.collisionDetect();
  circle.checkBounds();

  // start time
  time = (Date.now() - startTime) / 1000;
  counter_time.innerHTML = `Time: ${time.toFixed(2)}`;
  if (ball_count == 0) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    window.alert(`You scored ${points} points in ${time.toFixed(2)} seconds.\nYour overall score is ${points*(1/time).toFixed(2)}.\nClick ok to play again.`);
    setup();

    startTime = Date.now();
    requestAnimationFrame(loop);
  } else {
    // start animation loop
    requestAnimationFrame(loop);
  }
}

// start time
var startTime = Date.now();

// call the loop function
loop();
