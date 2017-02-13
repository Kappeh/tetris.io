var gridArray = [];
var score;
var lines;
var holdTetromino;
var holdPossible = true;

var keys =
{
	moveLeft: false,
	moveRight: false,
	rotate: false,
	drop: false
}

function init()
{
	//initializes game
	for(var x = 0;x < 10;x++)
		for(var y = 0;y < 20;y++)
			gridArray.push(0);

	score = 0;
	lines = 0;

	getNextTetromino();
}

function getGridState(x, y)
{
	//out of bound prevention
	if(x >= 0 && x < 10 && y >= 0 && y < 20)
		return gridArray[y * 10 + x];
	return null;
}

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

//listenes for keypress
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
		if(state)
			rotate();
	}
	else if(e.keyCode == 65 || e.keyCode == 37)
	{
		//A or Left has been pressed
		if(state)
			left();
	}
	else if(e.keyCode == 83 || e.keyCode == 40)
	{
		//S or Down has been pressed
		if(state)
			drop();
	}
	else if(e.keyCode == 68 || e.keyCode == 39)
	{
		//D or Right has been pressed
		if(state)
			right();
	}
	else if (e.keyCode == 32){
		hold();
	}
}

function drop()
{
	if(!currentTetromino.move(0, 1))
	{
		if(currentTetromino)
			currentTetromino.destroy();

		holdPossible = true;
		getNextTetromino();
	}
}

function hold()
{
	if (! holdPossible)
		return;

	if (! holdTetromino)
	{
		holdTetromino = currentTetromino.index;
		getNextTetromino();
	}
	else
	{
		var tempIndex = currentTetromino.index;
		getNextTetromino(holdTetromino);
		holdTetromino = tempIndex;
	}

	holdPossible = false;
}

function rotate()
{
	currentTetromino.rotate();
}

function right()
{
	currentTetromino.move(1, 0);
}

function left()
{
	currentTetromino.move(-1, 0);
}

function testLines()
{
	var lineCount = 0;
	for(var y = 0;y < 20;y++)
	{
		var line = true;

		for(var x = 0;x < 10;x++)
		{
			if(getGridState(x, y) == 0)
			{
				line = false;
				break;
			}
		}

		if(line)
		{
			lineCount++;
			breakLine(y);
		}
	}
	score += getScore(lineCount);
	lines += lineCount;
}

function breakLine(line)
{
	for(var y = line;y > 0;y -= 1)
	{
		for(var x = 0;x < 10;x ++)
			setGridState(x, y, getGridState(x, y - 1));
	}
}

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
