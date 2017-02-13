var width = 1500, height = 800;
var canvas, ctx;
var dropSpeed = 30;

function createCanvas()
{
	//Creates canvas in html
	canvas = document.createElement("canvas");
	ctx = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;

	document.body.appendChild(canvas);
}

var currentFrame = 0;

function draw()
{
	if (gameOver)
		reset();

	//Clears out last frame
	ctx.fillStyle = "#111";
	ctx.fillRect(0, 0, width, height);

	//Draws board
	ctx.fillStyle = "#fff";
	ctx.fillRect(600, 100, 300, 600);

	ctx.strokeStyle = "#aaa";


	//Draws grid
	for(var y = 1;y < 20;y++)
	{
		ctx.beginPath();
		ctx.moveTo(600, y * 30 + 100);
		ctx.lineTo(900, y * 30 + 100);
		ctx.stroke();
	}

	for(var x = 1;x < 10;x++)
	{
		ctx.beginPath();
		ctx.moveTo(x * 30 + 600, 100);
		ctx.lineTo(x * 30 + 600, 700);
		ctx.stroke();
	}

	//Draws dropped pieces
	for(var x = 0;x < 10;x++)
	{
		for(var y = 0;y < 20;y++)
		{
			var index = getGridState(x, y);
			if(index)
				drawMino(x, y, tetrominoColours[index - 1]);
		}
	}

	currentFrame++;
	if(currentFrame	> dropSpeed)
	{
		currentFrame = 0;
		drop();
	}

	//Draws dropping piece
	currentTetromino.draw();
	//Draws held piece
	if(holdTetromino)
		holdTetromino.draw();
	//Draw queued pieces
	for(var x = 0;x < 3;x++)
		queue[x].draw();
}

function drawMino(x, y, colour)
{
	ctx.fillStyle = colour;
	ctx.fillRect(x * 30 + 600, y * 30 + 100, 30, 30);
}

function drawHeld(x, y, colour)
{
	ctx.fillStyle = colour;
	ctx.fillRect(x * 30 + 450, y * 30 + 130, 30, 30);
}

function drawQueue(x, y, colour, index)
{
	ctx.fillStyle = colour;
	ctx.fillRect(x * 30 + 930, y * 30 + index * 90 + 130, 30, 30);
}

window.onload = createCanvas();

//Initializes game
init();
//30fps drawloop
setInterval(draw, 1000/30);
