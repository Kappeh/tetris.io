//Global variables
//Width and height of canvas element
var width = 1500, height = 800;
//References to canvas element and canvas context
var canvas, ctx;
//Amount of frames per drop of tetromino
var dropSpeed = 30;
//Amount of frames since tetromino last dropped
var currentFrame = 0;
//Array containing which tiles are occupied
var gridArray = [];
//Score values
var score;
var lines;
var highScore = 0;
//Tetromino currently being help
var holdTetromino;
var holdPossible = true;
//Tetromino queue
var queue = [];
//Current falling tetromino
var currentTetromino;
//Game is paused
var paused = false;
//Level speeds
var dropSpeeds = [30, 25, 20, 15, 10, 5, 1];
var level = 0;

function createCanvas()
{
	//Creates canvas in html
	canvas = document.createElement("canvas");
	ctx = canvas.getContext("2d");

	//Width and height of canvas
	canvas.width = width;
	canvas.height = height;

	//Adds canvas element into DOM
	document.body.appendChild(canvas);

	//Initializes game
	init();
	//30fps drawloop
	setInterval(draw, 1000/30);
}

function draw()
{
	//Tests for gameover
	if (gameOver)
		reset();

	//Clears out last frame
	ctx.fillStyle = "#111";
	ctx.fillRect(0, 0, width, height);

	//Draws board
	var background = new Image();
	background.src = "./textures/background.png";
	ctx.drawImage(background, 600, 100, 300, 600);

	//Draws border
	ctx.strokeStyle = "#fff";
	ctx.beginPath();
	ctx.moveTo(600, 100);
	ctx.lineTo(900, 100);
	ctx.lineTo(900, 700);
	ctx.lineTo(600, 700);
	ctx.lineTo(600, 100);
	ctx.stroke();

	//Draw scores
	ctx.fillStyle = "#fff";
	ctx.font = "30px Arial";

	ctx.fillText("High Score", 930, 490);
	ctx.fillText("Current Score", 930, 530);
	ctx.fillText("Lines", 930, 570);

	ctx.fillText(": " + highScore, 1130, 490);
	ctx.fillText(": " + score, 1130, 530);
	ctx.fillText(": " + lines, 1130, 570);

	//Draws dropping piece
	currentTetromino.draw();
	//Draws current piece's shadow
	drawShadow();
	//Draws held piece
	if(holdTetromino)
		holdTetromino.draw();
	//Draw queued pieces
	for(var x = 0;x < 3;x++)
		queue[x].draw();

	//Draws dropped pieces
	for(var x = 0;x < 10;x++)
	{
		for(var y = 0;y < 20;y++)
		{
			var index = getGridState(x, y);
			if(index)
				drawMino(x, y, index - 1);
		}
	}

	if(!paused)
	{
		//Tests to see if drop should happen
		currentFrame++;
		if(currentFrame	> dropSpeeds[level])
		{
			currentFrame = 0;
			drop();
		}

	}
	else
	{
		ctx.fillText("Paused!", 696, 300);
	}
}

//Draws a mino in the grid
function drawMino(x, y, colour)
{
	ctx.drawImage(textures[colour], x * 30 + 600, y * 30 + 100, 30, 30);
}

//Draws the currently help mino
function drawHeld(x, y, colour)
{
	ctx.drawImage(textures[colour], x * 30 + 450, y * 30 + 130, 30, 30);
}

//Draws minos in the queue
function drawQueue(x, y, colour, index)
{
	ctx.drawImage(textures[colour], x * 30 + 930, y * 30 + index * 90 + 130, 30, 30);
}

//Draws the predictive shadow below a piece
function drawShadow()
{
	const currMino = currentTetromino;
	var offset = 0;

	//Finds the biggest offset that has valid position
	while (isValidPosition(currMino.pos.x, currMino.pos.y + offset, currMino.minos, currMino.size))
		offset ++;
	offset -= 1;

	//Draws translucent tetromino at that offset
	ctx.globalAlpha = 0.2;
	currMino.draw(currMino.pos.x, currMino.pos.y + offset);
	ctx.globalAlpha = 1;
}

function hardDrop()
{
	while(drop());
}

//Creates canvas and starts game when window is loaded
window.onload = createCanvas();
