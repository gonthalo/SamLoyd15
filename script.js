var lienzo = document.getElementById("lienzo");
var pluma = lienzo.getContext("2d");
var barra = document.getElementById("bar");
var puzzle = [];
// constantes
var grid_size = 80;
var square_size = 70;
var font_puzzle = '35px Arial';
var font_win = '20px Arial';
var offset = 50;
var start_time = -1;
var movimientos = 0;
var reborde = [50,50,255];

function prod(lis, k){
	for (var ii=0; ii<3; ii++){
		lis[ii] = parseInt(lis[ii]*k);
	}
	return lis;
}
function randcol(){
	var lis = [parseInt(Math.random()*4)*85, parseInt(Math.random()*4)*85, parseInt(Math.random()*4)*85];
	if (lis[0] + lis[1] + lis[2]==0){
		return randcol();
	}
	return lis;
}

function rgbstr(lis){
	return "rgb(" + lis[0] + "," + lis[1] + "," + lis[2] + ")";
}

function px(p, q){
	pluma.fillRect(p, q, 1, 1);
}

function square(p, q, d, c){
	pluma.fillStyle = c;
	pluma.fillRect(p - d, q - d, 1, 2*d);
	pluma.fillRect(p - d, q + d, 2*d, 1);
	pluma.fillRect(p - d + 1, q - d, 2*d, 1);
	pluma.fillRect(p + d, q - d + 1, 1, 2*d);
}

function block(p, q, d, c){
	tope = 7
	for (var tt=0; tt<tope; tt++){
		square(p, q, d - tt, rgbstr(prod([c[0], c[1], c[2]], tt*(32 - 5*tt)/51.0)));
	}
	pluma.fillStyle = rgbstr([255,255,255]);//= rgbstr([c[0], c[1], c[2]]);
	pluma.fillRect(p - d + tope, q - d + tope, 2*(d-tope) + 1 , 2*(d - tope) + 1);
}

function dibujar(){
	for (var ii = 0; ii < 4; ii++){
		for (var jj = 0; jj < 4; jj++){
			if (puzzle[4*ii+jj] != 0){
				block(grid_size*ii + offset, grid_size*jj + offset, square_size/2, reborde);
				pluma.fillStyle = "black";
				pluma.font = font_puzzle;
				pluma.textAlign = "center";
				pluma.fillText(puzzle[4*ii+jj] + "", grid_size*ii + offset, grid_size*jj + 10 + offset);
			} else {
				pluma.fillStyle = "white";
				pluma.fillRect(grid_size*ii + offset - square_size/2, grid_size*jj + offset - square_size/2, square_size + 1, square_size + 1)
			}
		}
	}
}

function generar(){
	puzzle = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
	var ii = 0;
	while (ii < 99){
		var r1 = parseInt(Math.random()*16);
		var r2 = parseInt(Math.random()*16);
		if ((r1-r2)*r1*r2 != 0){
			ii ++;
			var aux = puzzle[r1];
			puzzle[r1] = puzzle[r2];
			puzzle[r2] = aux;
		}
	}
}

lienzo.addEventListener("click", function (e){
}, false);

window.addEventListener("keydown", function(event) {
	vector = [0, 0];
	if (event.keyCode == 37){
		//console.log("left");
		vector = [-1, 0];
	} else if (event.keyCode == 38){
		//console.log("up");
		vector = [0, -1];
	} else if (event.keyCode == 39){
		//console.log("right");
		vector = [1, 0];
	} else if (event.keyCode == 40){
		//console.log("down");
		vector = [0, 1];
	} else {
		return;
	}
	//console.log("pressed");
	ind = puzzle.indexOf(0);
	ii = parseInt(ind/4) - vector[0];
	jj = ind%4 - vector[1]
	if (ii < 0 || ii > 3 || jj < 0 || jj > 3){
		return;
	}
	//console.log("permutando");
	movimientos = movimientos + 1;
	puzzle[ind] = puzzle[4*ii + jj];
	puzzle[4*ii + jj] = 0;
	actualizar();
});

function resuelto(){
	pluma.fillStyle = "blue";
	pluma.font = font_win;
	pluma.textAlign = "left";
	pluma.fillText("Felicidades!", 300, 300)
	var d = new Date(Date());
	pluma.fillText("Tiempo: " + parseInt((d.getTime() - start_time)/1000) + " segundos", 300, 330)
	pluma.fillText("Movimientos: " + movimientos, 300, 360)
}

function actualizar(){
	dibujar();
	for (var ii=0; ii<4; ii++){
		for (var jj=0; jj<4; jj++){
			if (puzzle[ii+4*jj] != (jj+4*ii+1)%16){
				return;
			}
		}
	}
	console.log("solved");
	resuelto();
}

function resetear(){
	pluma.fillStyle = "white";
	pluma.fillRect(0,0,1000,1000)
	generar();
	actualizar();
	movimientos = 0;
	var d = new Date(Date());
	start_time = d.getTime();
}

function comenzar(){
	resetear();
	dibujar();
}

comenzar();
