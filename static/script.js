b = new Board()
var d = document.getElementById("inTable")
d.innerHTML = genInTableHTML(9,9)

function solveButton(){
  b.setBoard(readTable(9,9,"t"))
  b.compoundSolve()
  var d = document.getElementById("outTable")
  d.innerHTML = genTableHTML(9,9,b.values)
  document.getElementById("outdiv").style.display = "block"
}