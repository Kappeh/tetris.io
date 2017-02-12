var width = 1500, height = 800;
var canvas, ctx;

function createCanvas()
{
	//Creates canvas in html
	canvas = document.createElement("canvas");
	ctx = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;

	document.body.appendChild(canvas);
}

function draw()
{
	//draws shit
	//board
	ctx.fillStyle = "#fff";
	ctx.fillRect(600, 100, 300, 600);

	ctx.strokeStyle = "#aaa";

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
}

window.onload = createCanvas();

//30fps drawloop
setInterval(draw, 1000/30);