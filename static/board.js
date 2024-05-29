//Board.js ported from Java.
//Define board size constants
SIZE = 9;
//defines width of subsquares
SUBSIZE = 3;

function reportImpossibility(){
  console.log("Impossibility detected")
}

function intA(s){
  var o = []
  for(var i=0;i<s;i++){
    o.push(0);
  }
  return o;
}

function int2A(sx, sy){
  var o2 = []
  for(var x=0; x<sx; x++){
    var r=intA(sy);
      o2.push(r);
    }
  return o2
}

function equalA(a, b){
  if(a.length != b.length){
    return false;
  }
  var same = true;
  for(var i=0; i<a.length; i++){
    if(a[i]!=b[i]){
      same = false;
    }
  }
  return same;
}

function indexesOf(array, target) {
		var out = intA(targetCount(array, target));
		var w = 0;
		for (var i = 0; i < array.length; i++) {
			var v = array[i];
			if (v == target) {
				out[w] = i;
				w++;
			}
		}
		return out;
}

function targetCount(array, target) {
		var count = 0;
		for (var i = 0; i < array.length; i++) {
			var j = array[i];
			if (j == target) {
				count++;
			}
		}
		return count;
	}

class Board{
  constructor(){
    //initialize a 2d array of SIZE by SIZE
    this.values = int2A(SIZE, SIZE);
  }
    //get and fetch commands
    getValue(x,y){
      return this.values[y-1][x-1];
    }
    setValue(x,y,val){
      this.values[y-1][x-1] = val;
    }
    
    //assign a 2d table to board
    setBoard(bValues){
      this.values = bValues;
    }

    //Fetch commands
    //Determines what numbers exist within a row, square, column
    //A row containing 1, 2, and 4 would yield
    //[1,1,0,1,0,0,0,0,0]
    
    //Fetch the numbers within a row
  getRow(y) {
		var out = intA(SIZE);
		for (var i = 0; i < SIZE; i++) {
			var j = this.values[y][i];
			if (j >= 1 && j <= SIZE) {
				out[j - 1] = 1;
			}
		}
		return out;
	}
  
  getCol(x) {
		var out = intA(SIZE);
		for (var i = 0; i < SIZE; i++) {
		  var j = this.values[i][x];
			if (j >= 1 && j <= SIZE) {
				out[j - 1] = 1;
			}
		}
		return out;
	}
  
  getSquare( x,  y) {
		var squareX = x - x % (SUBSIZE);
		var squareY = y - y % (SUBSIZE);
		var out = intA(SIZE);
		for (var xi = 0; xi < SUBSIZE; xi++) {
			for (var yi = 0; yi < SUBSIZE; yi++) {
				var j = this.values[squareY + yi][squareX + xi];
				if (j >= 1 && j <= SIZE) {
					out[j - 1] = 1;
				}
			}
		}
		return out;
	}

  compareArray(a, b) {
		var out = new intA(a.length);
		for (var i = 0; i < a.length; i++) {
			var j = a[i];
			var j2 = b[i];
			if (j == 1 || j2 == 1) {
				out[i] = 1;
			}
		}
		return out;
	}

  getPossibilities( x,  y) {
		if (this.values[y][x] != 0) {
			var out = intA(SIZE);
			for (var i = 0; i < out.length; i++) {
				if (i + 1 != this.values[y][x]) {
					out[i] = 1;
				}
			}
			return out;
		}
		var out = this.getRow(y);
		out = this.compareArray(out, this.getCol(x));
		out = this.compareArray(out, this.getSquare(x, y));
		var deadArray = [1, 1, 1, 1, 1, 1, 1, 1, 1];
		if (equalA(out, deadArray)) {
			reportImpossibility();
		}
		return out;
	}

  

  

  addArray(a, b) {
		var sum = intA(a.length);
		for (var i = 0; i < a.length; i++) {
			sum[i] = a[i] + b[i];
		}
		return sum;
	}

  flipArray(a) {
		var out = new intA(a.length);
		for (var i = 0; i < a.length; i++) {
			out[i] = 1 - a[i];
		}
		return out;
	}
  
  simpleSolveUnit(x, y) {
		if (this.values[y][x] != 0) {
			return this.values[y][x];
		}
		var possibilities = this.getPossibilities(x, y);
		if (targetCount(possibilities, 0) == 1) {
			return possibilities.indexOf(0) + 1;
		}
		return 0;
	}

  simpleSolveI() {
		var next = int2A(SIZE, SIZE);
		for (var x = 0; x < SIZE; x++) {
			for (var y = 0; y < SIZE; y++) {
				next[y][x] = this.simpleSolveUnit(x, y);
			}
		}
		this.values = next;
	}

  // Runs compound solve on a unit within a row
	// changes values accordingly; does not return a value
	compoundSolveRow(y) {
		// find possibilities of each unit in row
		var rowPossibilities = int2A(SIZE,SIZE);
		for (var x = 0; x < rowPossibilities.length; x++) {
			rowPossibilities[x] = this.flipArray(this.getPossibilities(x, y));
		}
		// add up all possibilities into sum
		var sums = intA(SIZE);
		for (var p = 0; p < rowPossibilities.length; p++) {
			sums = this.addArray(sums, rowPossibilities[p]);
		}
    if(sums.indexOf(0)!=-1){
      reportImpossibility()
    }
		//
		//
		// if a possibility is unique, whatever square contains the possibility
		// can be solved
		var unique = indexesOf(sums, 1);
		for (var x = 0; x < SIZE; x++) {
			var xPossibilities = this.getPossibilities(x, y);
			for (var u=0; u<unique.length; u++) {
        var searchVal = unique[u]
				if (xPossibilities[searchVal] == 0) {
					this.values[y][x] = searchVal + 1; // offset by 1; [0,8] becomes [1,9]
				}
			}
		}
	}

  compoundSolveCol(x) {
		var rowPossibilities = int2A(SIZE,SIZE);
		for (var y = 0; y < rowPossibilities.length; y++) {
			rowPossibilities[y] = this.flipArray(this.getPossibilities(x, y));
		}
		// add up all possibilities into sum
		var sums = intA(SIZE);
		for (var p = 0; p < rowPossibilities.length; p++) {
			sums = this.addArray(sums, rowPossibilities[p]);
		}
    //detect Impossibility
    if(sums.indexOf(0)!=-1){
      reportImpossibility()
    }
		// if a possibility is unique, whatever square contains the possibility
		// can be solved
		var unique = indexesOf(sums, 1);
		for (var y = 0; y < SIZE; y++) {
			var yPossibilities = this.getPossibilities(x, y);
			for (var u=0; u<unique.length; u++) {
        var searchVal = unique[u]
				if (yPossibilities[searchVal] == 0) {
					this.values[y][x] = searchVal + 1; // offset by 1; [0,8] becomes [1,9]
				}
			}
		}
	}
  
  
  compoundSolveSquare(n) {
		var sX = SUBSIZE * (n % SUBSIZE);
		var sY = SUBSIZE * Math.floor(n / SUBSIZE);
		// find possibilities of each unit in square
		var sqrPossibilities = int2A(SIZE,SIZE);
		for (var x = 0; x < SUBSIZE; x++) {
			for (var y = 0; y < SUBSIZE; y++) {
				sqrPossibilities[x + SUBSIZE * y] = this.flipArray(this.getPossibilities(x + sX, y + sY));
			}
		}
		// add up possibilities into sum
		var sums = new intA(SIZE);
		for (var p = 0; p < sqrPossibilities.length; p++) {
			sums = this.addArray(sums, sqrPossibilities[p]);
		}
    //detect Impossibility
    if(sums.indexOf(0)!=-1){
      reportImpossibility()
    }
		// if a possibility is unique, whatever square contains the possibility
		// can be solved
	  var unique = indexesOf(sums, 1);
    
		// update units
		for (var x = 0; x < SUBSIZE; x++) {
			for (var y = 0; y < SUBSIZE; y++) {
				var uPossibilities = this.getPossibilities(x + sX, y + sY);
				// replace square
				for (var u=0; u<unique.length; u++) {
          var searchVal = unique[u]
					if (uPossibilities[searchVal] == 0) {
						// System.out.println("Setting " + x + "," + y + " to " + (1 + searchVal));
						this.values[y + sY][x + sX] = searchVal + 1; // offset by 1; [0,8] becomes [1,9]
					}
				}
			}
		}
	}
  
  //Run a single compoundsolve iteration
  compoundSolveI() {
		for (var t = 0; t < SIZE; t++) {
      this.compoundSolveRow(t);
			this.compoundSolveCol(t);
			this.compoundSolveSquare(t);
		}
	}

  toString() {
		var out = "";
		for (var row = 0; row < this.values.length; row++) {
			var rowArray = this.values[row];
			for (var i = 0; i < rowArray.length; i++) {
				var item = rowArray[i];
				if (item != 0) {
					out += item;
				} else {
					out += " ";
				}
				if (i % SUBSIZE == SUBSIZE - 1) {
					out += "|";
				}
			}
			if (row % SUBSIZE == SUBSIZE - 1) {
				out += "\n";
				var panels = SIZE / SUBSIZE;
				for (var p = 0; p < panels; p++) {
					for (var p2 = 0; p2 < SUBSIZE; p2++) {
						out += "-";
					}
					out += "+";
				}
			}
			out += "\n";
		}
		return out;
	}

  compoundSolve() {
		var last = this.toString();
		this.simpleSolveI();
		this.compoundSolveI();
		while (last != this.toString()) {
			last = this.toString();
			this.simpleSolveI();
			this.compoundSolveI();
		}
	}
}