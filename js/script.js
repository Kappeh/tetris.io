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

	ctx.strokeStyle = "#555";

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

	currentFrame++;
	if(currentFrame	> dropSpeed)
	{
		currentFrame = 0;
		drop();
	}

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

	//Draw scores
	ctx.fillStyle = "#fff";
	ctx.font = "30px Arial";

	ctx.fillText("High Score", 930, 490);
	ctx.fillText("Current Score", 930, 530);
	ctx.fillText("Lines", 930, 570);

	ctx.fillText(": " + highScore, 1130, 490);
	ctx.fillText(": " + score, 1130, 530);
	ctx.fillText(": " + lines, 1130, 570);
}

function drawMino(x, y, colour)
{
	ctx.drawImage(textures[colour], x * 30 + 600, y * 30 + 100, 30, 30);
}

function drawHeld(x, y, colour)
{
	ctx.drawImage(textures[colour], x * 30 + 450, y * 30 + 130, 30, 30);
}

function drawQueue(x, y, colour, index)
{
	ctx.drawImage(textures[colour], x * 30 + 930, y * 30 + index * 90 + 130, 30, 30);
}

function drawShadow()
{
	const currMino = currentTetromino;
	var offset = 0;

	while (isValidPosition(currMino.pos.x, currMino.pos.y + offset, currMino.minos, currMino.size))
		offset ++;

	ctx.globalAlpha = 0.2;
	currMino.draw(currMino.pos.x, currMino.pos.y + offset - 1);
	ctx.globalAlpha = 1;
}

window.onload = createCanvas();

//Initializes game
init();
//30fps drawloop
setInterval(draw, 1000/30);
