var currentTetromino;

var rotation4x4 =
	[12, 8, 4, 0,
 	 13, 9, 5, 1,
 	 14, 10, 6, 2,
 	 15, 11, 7, 3];

var rotation3x3 =
	[6, 3, 0,
	 7, 4, 1,
	 8, 5, 2];

var tetromino_Long =
	[0, 0, 0, 0,
	 1, 1, 1, 1,
	 0, 0, 0, 0,
	 0, 0, 0, 0];

var tetromino_L =
	[1, 1, 1,
	 1, 0, 0,
	 0, 0, 0];

var tetromino_J =
	[1, 1, 1,
	 0, 0, 1,
	 0, 0, 0];

var tetromino_S =
	[0, 1, 1,
	 1, 1, 0,
	 0, 0, 0];

var tetromino_Z =
	[1, 1, 0,
	 0, 1, 1,
	 0, 0, 0];

var tetromino_T =
	[0, 1, 0,
	 1, 1, 1,
	 0, 0, 0];

var tetromino_Square =
	[1, 1,
	 1, 1];

var textures = [];
for(var x = 0;x < 7;x++)
{
	var image = new Image();
	image.src = "./textures/mino" + x + ".png";
	textures.push(image);
}

var tetrominos = [tetromino_Long, tetromino_L, tetromino_J, tetromino_S, tetromino_Z, tetromino_T, tetromino_Square];
var tetrominoColours = ["#f55", "#5f5", "#55f", "#ff5", "#f5f", "#5ff", "#555"];

//type 0: falling, 1: hold, 2-4: queue
var Tetromino = function(index, type)
{
	this.pos = {
		x: 4,
		y: 0
	};

	this.type = type;

	this.index = index;

	this.minos = tetrominos[this.index];

	if(index == 0)
		this.rotationMatrix = rotation4x4;
	else if (index < 6)
		this.rotationMatrix = rotation3x3;
	else
		this.rotationMatrix = null;

	if(index == 0)
		this.size = 4;
	else if (index < 6)
		this.size = 3;
	else
		this.size = 2;
}
Tetromino.prototype.draw = function()
{
	for(var x = 0;x < this.size;x++)
	{
		for(var y = 0;y < this.size;y++)
		{
			if(this.minos[y * this.size + x])
			{
				if(this.type == 0)
					drawMino(this.pos.x + x, this.pos.y + y, this.index);
				else if(this.type == 1)
					drawHeld(x, y, this.index);
				else
					drawQueue(x, y, this.index, this.type - 2);
			}
		}
	}
}
Tetromino.prototype.reset = function()
{
	//Resets position and rotation
	this.minos = tetrominos[this.index];
	this.pos = {
		x: 4,
		y: 0
	};
}
Tetromino.prototype.move = function(x, y)
{
	if(isValidPosition(x + this.pos.x, y + this.pos.y, this.minos, this.size))
	{
		this.pos.x += x;
		this.pos.y += y;
		return true;
	}
	return false;
}
Tetromino.prototype.rotate = function()
{
	sizeSquared = this.size * this.size;
	var newArray = [];

	for(var x = 0;x < sizeSquared;x++)
		newArray[x] = this.minos[this.rotationMatrix[x]];

	if(isValidPosition(this.pos.x, this.pos.y, newArray, this.size))
	{
		this.minos = newArray;
		return true;
	}
	return false;
}
Tetromino.prototype.destroy = function()
{
	for(var x = 0;x < this.size;x++)
	{
		for(var y = 0;y < this.size;y++)
		{
			if(this.minos[y * this.size + x])
				gridArray[(this.pos.y + y) * 10 + this.pos.x + x ] = this.index + 1;
		}
	}
}

function getNextTetromino(receivedIndex)
{
	testLines();

	if(receivedIndex != null)
	{
		currentTetromino = new Tetromino(receivedIndex, 0);
		return;
	}

	currentTetromino = queue[0];
	queue[0] = queue[1];
	queue[1] = queue[2];

	var index = Math.floor(Math.random() * 7);
	queue[2] = new Tetromino(index, 4);

	currentTetromino.type = 0;
	queue[0].type = 2;
	queue[1].type = 3;
	queue[2].type = 4;

	if (!isValidPosition(currentTetromino.pos.x, currentTetromino.pos.y, currentTetromino.minos, currentTetromino.size))
		gameOver = true
}

var isValidPosition = function(posx, posy, minos, size)
{
	//Checks to see that the tetromino is in valid position
	for(var x = 0;x < size;x++)
	{
		for(var y = 0;y < size;y++)
		{
			if(!minos[size * y + x])
				continue;

			if(getGridState(x + posx, y + posy) != 0)
				return false;
		}
	}
	return true;
}
