import React from "react";

function getTexto() {
  var x = document.getElementById("p").innerHTML
 
}

function GuardarPalabras() {
  return (
    <div>
      <center>
        <p id="p">hola</p>
        <input type="button" value="Get Selection" onClick={getTexto()} />
        <form name="testform">
          <textarea id="sel" rows="5" cols="20"></textarea>
        </form>
      </center>
    </div>
  );
}

export default GuardarPalabras;
