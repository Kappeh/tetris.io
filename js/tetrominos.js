//Matricies used to rotate tetromino
var rotation4x4 =
	[12, 8, 4, 0,
 	 13, 9, 5, 1,
 	 14, 10, 6, 2,
 	 15, 11, 7, 3];

var rotation3x3 =
	[6, 3, 0,
	 7, 4, 1,
	 8, 5, 2];

//Initial shapes of tetrominos
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


//Loads textures into an array
var textures = [];
//For each texture
for(var x = 0;x < 7;x++)
{
	//Push texture into array
	var image = new Image();
	image.src = "./textures/mino" + x + ".png";
	textures.push(image);
}

//Array of all shapes of tetromino
var tetrominos = [tetromino_Long, tetromino_L, tetromino_J, tetromino_S, tetromino_Z, tetromino_T, tetromino_Square];

//Constructs tetromino
//index is the shape/texture/colour of tetromino being constructed
//type = 0: falling
//type = 1: being help
//type = 2-4: in queue
var Tetromino = function(index, type)
{
	//sets default values
	this.pos = {
		x: 4,
		y: 0
	};
	this.type = type;
	this.index = index;
	this.minos = tetrominos[this.index];

	//Sets this.size to correct value
	if(index == 0)
		this.size = 4;
	else if (index < 6)
		this.size = 3;
	else
		this.size = 2;

	//Finds which rotation matrix is needed for this tetromino
	if(index == 0)
		this.rotationMatrix = rotation4x4;
	else if (index < 6)
		this.rotationMatrix = rotation3x3;
	else
		this.rotationMatrix = null;
}
Tetromino.prototype.draw = function(x, y)
{
	//Caches position + offset
	var pos = {
		x : x ? x : this.pos.x,
		y : y ? y : this.pos.y
	}

	//For each slot in tetromino
	for(var x = 0;x < this.size;x++)
	{
		for(var y = 0;y < this.size;y++)
		{
			//If mino is present
			if(this.minos[y * this.size + x])
			{
				//Draw mino in relevant way
				//(On grid / In hold slot / In queue)
				if(this.type == 0)
					drawMino(pos.x + x, pos.y + y, this.index);
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
//Moves tetromino if valid
Tetromino.prototype.move = function(x, y)
{
	//Checks if move is valid
	if(isValidPosition(x + this.pos.x, y + this.pos.y, this.minos, this.size))
	{
		//If valid, update position
		this.pos.x += x;
		this.pos.y += y;
		return true;
	}
	return false;
}
//Rotates tetromino if valid
Tetromino.prototype.rotate = function()
{
	//Caches dimensions
	var sizeSquared = this.size * this.size;
	//Creates new shape array
	var newArray = [];

	//For all minos, place them in new array with respect to rotation matrix
	for(var x = 0;x < sizeSquared;x++)
		newArray[x] = this.minos[this.rotationMatrix[x]];

	//If new array is in valid position
	if(isValidPosition(this.pos.x, this.pos.y, newArray, this.size))
	{
		//Set tetromino to new array
		this.minos = newArray;
		return true;
	}
	return false;
}
//Updates grid array to leave minos on board
Tetromino.prototype.destroy = function()
{
	//For all slots of tetromino
	for(var x = 0;x < this.size;x++)
	{
		for(var y = 0;y < this.size;y++)
		{
			//If mino is present, set gridArray to tetromino index (used for colour/texture)
			if(this.minos[y * this.size + x])
				gridArray[(this.pos.y + y) * 10 + this.pos.x + x ] = this.index + 1;
		}
	}
}

//Spawns new tetromino and updates queue
function getNextTetromino(receivedIndex)
{
	//Tests if there are full lines
	testLines();

	//If specific index is given
	if(receivedIndex != null)
	{
		//Spawn tetrominio with that index and exit function
		currentTetromino = new Tetromino(receivedIndex, 0);
		return;
	}

	//If specific index is not given
	//Shift all tetrominos in queue
	currentTetromino = queue[0];
	queue[0] = queue[1];
	queue[1] = queue[2];
	//Add new tetromino to queue
	var index = Math.floor(Math.random() * 7);
	queue[2] = new Tetromino(index, 4);

	//Update tetromino types
	currentTetromino.type = 0;
	queue[0].type = 2;
	queue[1].type = 3;
	queue[2].type = 4;

	//If new tetromino spawns in invalid position, end game
	if (!isValidPosition(currentTetromino.pos.x, currentTetromino.pos.y, currentTetromino.minos, currentTetromino.size))
		gameOver = true
}

//Tests if tetromino is in valid position (does not intersect with other minos or goes out of bounding box)
var isValidPosition = function(posx, posy, minos, size)
{
	//For all slots in tetromino
	for(var x = 0;x < size;x++)
	{
		for(var y = 0;y < size;y++)
		{
			//If no mino, test next slot
			if(!minos[size * y + x])
				continue;

			//If mino and same slot on grid is already occupied, return false
			if(getGridState(x + posx, y + posy) != 0)
				return false;
		}
	}
	//If tetromino gets through all these check, it is in valid position
	//Therefore, return true
	return true;
}
