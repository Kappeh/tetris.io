//colours for different tetrominos
var colours = [];

var currentTetromino;

var rotation4x4 =
	[3, 7, 11, 15,
 	 2, 6, 10, 14,
 	 1, 5, 9, 13,
 	 0, 4, 8, 12];

var rotation3x3 =
	[2, 5, 8,
	 1, 4, 7,
	 0, 3, 6];

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
	[0, 0, 0,
	 1, 1, 1,
	 0, 1, 0];

var tetromino_Square =
	[1, 1,
	 1, 1];

var tetrominos = [tetromino_Long, tetromino_L, tetromino_J, tetromino_S, tetromino_Z, tetromino_T, tetromino_Square];
var tetrominoColours = ["#f55", "#5f5", "#55f", "#ff5", "#f5f", "#5ff", "#555"];

var Tetromino = function(index)
{
	this.pos = {
		x: 4,
		y: 0
	};

	this.index = index;

	this.minos = tetrominos[index];
	this.colour = tetrominoColours[index];

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
				drawMino(this.pos.x + x, this.pos.y + y, this.colour);
		}
	}
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

	var index = receivedIndex ? receivedIndex : Math.floor(Math.random() * 7);
	currentTetromino = new Tetromino(index);
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
