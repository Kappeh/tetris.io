function init()
{
	//initializes game
	for(var x = 0;x < 10;x++)
		for(var y = 0;y < 20;y++)
			gridArray.push(0);

	score = 0;
	lines = 0;
	gameOver = false;

	for(var x = 2;x < 5;x++)
		queue.push(new Tetromino(Math.floor(Math.random() * 7), x));

	getNextTetromino();
}

// Will reset the game after a gameover
function reset()
{
	holdTetromino = null;
	holdPossible = true;
	queue = [];
	gridArray = [];

	init();
}

//Returns the colour index, if any, of a mino in the grid
function getGridState(x, y)
{
	//out of bound prevention
	if(x >= 0 && x < 10 && y >= 0 && y < 20)
		return gridArray[y * 10 + x];
	return null;
}

//Sets the colour of a mino in the grid
function setGridState(x, y, value)
{
	//out of bound prevention
	if(x >= 0 && x < 10 && y >= 0 && y < 20)
	{
		gridArray[y * 10 + x] = value;
		return true;
	}
	return false;
}

//Listeners for keypress events
window.addEventListener("keydown", function(e){
	keyUpdate(e, true);
}, false);
window.addEventListener("keyup", function(e){
	keyUpdate(e, false);
}, false);

function keyUpdate(e, state)
{
	//filters keypress and updates relevant value
	if(e.keyCode == 87 || e.keyCode == 38)
	{
		//W or Up has been pressed
		//Rotate piece
		if(state && !paused)
			rotate();
	}
	else if(e.keyCode == 65 || e.keyCode == 37)
	{
		//A or Left has been pressed
		//Move piece left
		if(state && !paused)
			left();
	}
	else if(e.keyCode == 83 || e.keyCode == 40)
	{
		//S or Down has been pressed
		//Drop piece
		if(state && !paused)
			drop();
	}
	else if(e.keyCode == 68 || e.keyCode == 39)
	{
		//D or Right has been pressed
		//Move piece right
		if(state && !paused)
			right();
	}
	else if (e.keyCode == 32){
		//Space has been pressed
		//Hard drop
		if(state)
			hardDrop();
	}
	else if(e.keyCode == 27)
	{
		//Esc has been pressed
		//Toggle pause state
		if(state)
			paused = !paused;
	}
	else if(e.keyCode == 16)
	{
		//Shift has been pressed
		//Hold piece
		if(state && !paused)
			hold();
	}
}

//Moves currentTetromino down one square
function drop()
{
	//Tries to move currentTetromino down a tile
	if(!currentTetromino.move(0, 1))
	{
		//If try failed (due to invalid position)
		//Destroy currentTetromino
		if(currentTetromino)
			currentTetromino.destroy();

		//Reset holdPossible value
		holdPossible = true;
		//Spawns nextTetromino
		getNextTetromino();

		return false;
	}
	return true;
}

//Swaps piece in hold and current
function hold()
{
	//If not possible, exit function
	if (!holdPossible)
		return;

	//Checks if tetromino is being held
	if (!holdTetromino)
	{
		//If hold slot is empty
		//Holds current tetromino
		holdTetromino = currentTetromino;
		holdTetromino.reset();
		//Spawns a new tetromino
		getNextTetromino();
	}
	else
	{
		//If tetromino is in hold slot
		//Holds current tetromino
		var temp = currentTetromino;
		temp.reset();
		//Respawns tetromino from hold
		getNextTetromino(holdTetromino.index);
		holdTetromino = temp;
	}

	//Updates values
	holdTetromino.type = 1;
	holdPossible = false;
}

//Tries to rotate current falling tetromino
function rotate()
{
	currentTetromino.rotate();
}

//Tries to move current falling tetromino
function right()
{
	currentTetromino.move(1, 0);
}
function left()
{
	currentTetromino.move(-1, 0);
}

//Tests for horizontal lines that are full
function testLines()
{
	//Resets counter
	var lineCount = 0;
	for(var y = 0;y < 20;y++)
	{
		//For all lines, assume full
		var line = true;

		for(var x = 0;x < 10;x++)
		{
			//For all slots in row, test if empty
			if(getGridState(x, y) == 0)
			{
				//If empty, declare not full
				line = false;
				break;
			}
		}

		//If line is full after all tests
		if(line)
		{
			//Breaks the line and increments line count
			lineCount++;
			breakLine(y);
		}
	}

	//Updates scores
	score += getScore(lineCount);
	if (score > highScore) highScore = score;
	lines += lineCount;
}

//Empties a line and moves everything above it down
function breakLine(line)
{
	for(var y = line;y > 0;y -= 1)
	{
		//For all lines fron current line to top line,
		//for all slots in row,
		//set self to value of slot above
		for(var x = 0;x < 10;x ++)
			setGridState(x, y, getGridState(x, y - 1));
	}
}

//Returns value for amount of lines cleared
//1 line = 100 points
//2 line = 200 points
//3 line = 400 points
//4 line = 800 points
function getScore(lines)
{
	var value = 0;

	if(lines > 3)
		value += 400;
	if(lines > 2)
		value += 200;
	if(lines > 1)
		value += 100;
	if(lines > 0)
		value += 100;

	return value;
}
