var contador = 0;
var arregloProceso = [];

function cambiarTipoAlgoritmo() {
	var tiempoEspera = document.getElementById("tiempo-espera");
	var tiempoOcupacion = document.getElementById("tiempo-ocupacion");
	tiempoEspera.innerHTML = "";
	tiempoOcupacion.innerHTML = "";
	contador = 0;
	arregloProceso = [];
}

function obtenerDatosProceso() {
	var ordenLlegada = Number(document.getElementById("llegada").value);
	var ocupacionCPU = Number(document.getElementById("ocupacion").value);
	contador++;
	if(isNaN(ordenLlegada) || isNaN(ocupacionCPU)) {
		contador--;
		alert("Por favor ingrese solo números");
		inicio();
	} else if(ordenLlegada < 0 || ocupacionCPU < 0) {
		contador--;
		alert("Los numeros ingresados tienen que ser mayores a 0");
		inicio();
	} else {		
		agregarProceso(ordenLlegada, ocupacionCPU);
	}
}

function inicio() {
	var agregar = document.getElementById("agregar");
	agregar.addEventListener("click", obtenerDatosProceso);
	var cambiarProceso = document.getElementById("tipo-algoritmo");
	cambiarProceso.addEventListener("change", cambiarTipoAlgoritmo);
}

function agregarProceso(ordenLlegada, ocupacionCPU) {
	var cambiarProceso = document.getElementById("tipo-algoritmo").value;
	var procesoRepetido = false;	
	if (arregloProceso.length < 1) {
		console.log("estoy acà");
		arregloProceso.push({numero_proceso: 'proceso ' + contador, orden_llegada: ordenLlegada, ocupacion_CPU: ocupacionCPU});
	} else {
		arregloProceso.forEach(function(proceso){
			if(proceso.orden_llegada === ordenLlegada) {
				procesoRepetido = true;
			}
		});
		if(procesoRepetido) {
			contador--;
			alert("Ya hay un proceso que ocupa ese espacio en memoria");						
		} else { 			
			arregloProceso.push({numero_proceso: 'proceso ' + contador, orden_llegada: ordenLlegada, ocupacion_CPU: ocupacionCPU});			
		}	
	}	
	var tiempoEspera = document.getElementById("tiempo-espera");
	var tiempoOcupacion = document.getElementById("tiempo-ocupacion");
	if(cambiarProceso === "FCFS") {
		algoritmoFCFS(tiempoEspera, tiempoOcupacion);
	} else if(cambiarProceso === "STF Expulsivo"){
		algoritmoExplusivo();
	}
}

function algoritmoFCFS(tiempoEspera, tiempoOcupacion) {
	tiempoEspera.innerHTML  = "";
	tiempoOcupacion.innerHTML = "";
	arregloProceso = arregloProceso.sort(function (a, b) {
	  if (a.orden_llegada > b.orden_llegada) {
	    return 1;
	  }
	  if (a.orden_llegada < b.orden_llegada) {
	    return -1;
	  }
	  return 0;
	});

	arregloProceso.forEach(function (proceso) {
		tiempoEspera.innerHTML += "<p> <span class='contador-proceso'> " + proceso.numero_proceso + ":</span> " + proceso.orden_llegada + " segundos.</p>";
		tiempoOcupacion.innerHTML += "<p> <span class='contador-proceso'> " + proceso.numero_proceso + ":</span> " + proceso.ocupacion_CPU + " segundos.</p>";
	})


}

function algoritmoExplusivo() {
	var tiempoEspera = document.getElementById("tiempo-espera");
	var tiempoOcupacion = document.getElementById("tiempo-ocupacion");

}