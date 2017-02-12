var gridArray = [];

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
		keys.rotate = state;
		if(state)
			rotate();
	}
	else if(e.keyCode == 65 || e.keyCode == 37)
	{
		//A or Left has been pressed
		keys.moveLeft = state;
		if(state)
			left();
	}
	else if(e.keyCode == 83 || e.keyCode == 40)
	{
		//S or Down has been pressed
		keys.drop = state;
		if(state)
			drop();
	}
	else if(e.keyCode == 68 || e.keyCode == 39)
	{
		//D or Right has been pressed
		keys.moveRight = state;
		if(state)
			right();
	}
}

function drop()
{
	if(!currentTetromino.move(0, 1))
		getNextTetromino();
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
	var lines = 0;
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
			lines++;
			breakLine(y);
		}
	}
	console.log(lines);
}

function breakLine(line)
{
	for(var y = line;y > 0;y -= 1)
	{
		for(var x = 0;x < 10;x ++)
			setGridState(x, y, getGridState(x, y - 1));
	}
}