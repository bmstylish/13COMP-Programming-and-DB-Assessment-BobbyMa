/************************************************************/
// Written by Bobby Ma Term 1 - 2 2022: Game & Firebase Database 
// Based off the demo project built in p5 mini skils
// Click the ball game, resizes the canvas and runs click the ball game
// inside set canvas 
// v01: Copy and paste my project from the P5 mini skills 
// v02: Adjust project so it suits the purpose, eg. canvas adjustment 
// v03: Added speed difficulty to ball speed as score increases 
/************************************************************/

//Setting iniital constants and variables 
const CWIDTH = document.querySelector('#wrapper').offsetWidth;
const CHEIGHT = document.querySelector('#wrapper').offsetHeight;
const SPEEDRANGE = [
    [3, 5],
    [-5, -3],
    [6, 10],
    [-10, -6]
];

var hit = false;
var score;
var miss;
var timer;

var ball = [];
var ballAmount = 2;
var ballRadius = 55;
var hitRadius = 29.5;
var px2ball = [];

//Set up function that resets everything to do with the game, resizes canvas etc
function setupCvs() {
    //Settings game start stats 
    timer = 28;
    miss = -1;
    score = 0;
    document.getElementById('defaultCanvas0').style.display = 'block';
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById("gameName").style.display = 'none';
    document.getElementById("countdown").innerHTML = "29s";
    document.getElementById("score").innerHTML = "0";
    document.getElementById("highScore").innerHTML = highScore;
    document.getElementById("miss").innerHTML = "0";

    //Creating Canvas
    var canvas = createCanvas(CWIDTH, CHEIGHT + 0.14);
    resizeCanvas(CWIDTH, CHEIGHT + 0.14);
    canvas.parent('wrapper');
    ballCreate();

    //Timer 
    var gameTimer = setInterval(function() {
        if (timer <= 0) {
            //Game End Screen
            clearInterval(gameTimer);
            document.getElementById("countdown").innerHTML = "0s";
            //Displaying Score
            alert("Score: " + score);
            resizeCanvas(0, 0);
            //Resetting Ballspeed
            ball.forEach((element, index) => {
                ball[index].speedX = random(-3, 3);
                ball[index].speedY = random(-3, 3);
            });
            //Updating Score and resetting game
            scoreUpdate(score);
            document.getElementById('startBtn').style.display = 'block';
            document.getElementById("gameName").style.display = 'block';
        } else {
            document.getElementById("countdown").innerHTML = timer + "s";
        }
        timer -= 1;
    }, 1000);
}

//Stops game by setting timer to 0
function stopGame() {
    resizeCanvas(0, 0);
    timer = 0;
    document.getElementById('startBtn').style.display = 'block';
    document.getElementById("gameName").style.display = 'block';
}

//Default P5.js draw loop
function draw() {
    background(220);
    for (var i = 0; i < ball.length; i++) {
        //displaying and moving the ball
        ball[i].display();
        ball[i].movement();
    }
    dToBall();
}

//Tracks the distance to each ball from the mouse
function dToBall() {
    for (i = 0; i < ball.length; i++) {
        px2ball[i] = dist(ball[i].x, ball[i].y, mouseX, mouseY);
    }
}

//Creates ball 
function ballCreate() {
    for (var i = 0; i < ballAmount; i++) {
        ball[i] = {
            x: random(ballRadius, CWIDTH - ballRadius),
            y: random(ballRadius, CHEIGHT - ballRadius),
            speedX: random(-3, 3),
            speedY: random(-3, 3),

            display: function() {
                fill(100, 100, 100);
                ellipse(this.x, this.y, ballRadius, ballRadius);
            },

            movement: function() {
                if (this.x > CWIDTH - ballRadius / 2) {
                    this.speedX = this.speedX * -1;
                } else if (this.x < ballRadius / 2) {
                    this.speedX = this.speedX * -1;
                }

                this.x += this.speedX;

                if (this.y > CHEIGHT - ballRadius / 2) {
                    this.speedY = this.speedY * -1;
                } else if (this.y < ballRadius / 2) {
                    this.speedY = this.speedY * -1;
                }

                this.y += this.speedY;
            },
        };
    }
    ballAmount = 0;
}

// Adding score, or adding miss, based on whether the ball is clicked or not
// Changes speed difficulty when score reachs a certain point 
function mouseClicked() {
    for (var i = 0; i < ball.length; i++) {
        var level;
        //checking the distance to ball, and the ball radius to determine if hit or not
        if (px2ball[i] < hitRadius) {
            ball[i].x = random(ballRadius, width - ballRadius);
            ball[i].y = random(ballRadius, height - ballRadius);
            //Inital difficulty
            if (score < 5) {
                ball[i].speedX = random(-3, 3);
                ball[i].speedY = random(-3, 3);
            }
            //Difficulty upgrade
            if (score >= 5) {
                level = Math.floor(Math.random() * (2 - 0)) + 0;
                ball[i].speedX = random(SPEEDRANGE[level][0], SPEEDRANGE[level][1]);
                ball[i].speedY = random(SPEEDRANGE[level][0], SPEEDRANGE[level][1]);
                console.log("speedx:" + ball[i].speedX);
                console.log("speedy:" + ball[i].speedY);
            }
            //Difficulty upgrade
            if (score >= 10) {
                level = Math.floor(Math.random() * (4 - 2)) + 2;
                ball[i].speedX = random(SPEEDRANGE[level][0], SPEEDRANGE[level][1]);
                ball[i].speedY = random(SPEEDRANGE[level][0], SPEEDRANGE[level][1]);
            }
        }
    }
    hit = px2ball.some(function(e) {
        return e <= hitRadius;
    });

    //Adding score if hit
    if (hit == true) {
        score += 1;
        document.getElementById('score').innerHTML = score;
        console.log("score: " + score);
    }
    else {
        //Adding miss if not hit, and taking 1 away from score
        if (mouseX < width && mouseX > 0 && mouseY > 0 && mouseY < height) {
            miss += 1;
            if (score != 0) {
                score -= 1;
            }
            document.getElementById('miss').innerHTML = miss;
            document.getElementById('score').innerHTML = score;
            console.log("miss:" + miss);
        }
    }
}
