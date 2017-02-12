var gridArray = [];
var dropSpeed = 30;

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
	if(e.keyCode == 87)
	{
		//W has been pressed
		keys.rotate = state;
		if(state)
			currentTetromino.rotate();
	}
	else if(e.keyCode == 65)
	{
		//A has been pressed
		keys.moveLeft = state;
		if(state)
			currentTetromino.move(-1, 0);
	}
	else if(e.keyCode == 83)
	{
		//S has been pressed
		keys.drop = state;
		if(state)
			currentTetromino.move(0, 1);
	}
	else if(e.keyCode == 68)
	{
		//D has been pressed
		keys.moveRight = state;
		if(state)
			currentTetromino.move(1, 0);
	}
	else if(e.keyCode == 38)
	{
		//Up arrow has been pressed
		keys.rotate = state;
	}
	else if(e.keyCode == 37)
	{
		//Left arrow has been pressed
		keys.moveLeft = state;
	}
	else if(e.keyCode == 40)
	{
		//Down arrow has been pressed
		keys.drop = state;
	}
	else if(e.keyCode == 39)
	{
		//Right arrow has been pressed
		keys.moveRight = state;
	}
}

function update()
{
	//updates currect tetromino
}