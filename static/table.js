
function genTableHTML(rows, columns, data){
  var text = ""
  for(var r=0; r<rows; r++){
    text+="<tr>"
    for(var c=0; c<columns;c++){
      text+="<td><div class=\"toutput\">"
      if(data[r][c]!=0){
         text+=data[r][c]
      }else{
        text+=" "
      }
      text+="</div></td>"
    }
    text+="</tr>"
  }
  return text
}

function genInTableHTML(rows, columns, namestem="t"){
  var text = ""
  for(var r=0; r<rows; r++){
    text+="<tr>"
    for(var c=0; c<columns;c++){
      text+="<td><input maxlength=\"1\" autocomplete=\"off\" class=\"tinput\" type=\"text\""
      text+="id=\""+namestem+c+"-"+r+"\""
      
      text+="></td>"
    }
    text+="</tr>"
  }
  return text
}

function readTable(rows, columns, namestem){
  var out = int2A(columns, rows)
  for(var r=0; r<rows; r++){
    for(var c=0; c<columns;c++){
      var t = document.getElementById(namestem+c+"-"+r).value
      var v = parseInt(t)
      if(isNaN(v)){v=0;}
      out[r][c] = v
    }
  }
  return out
}