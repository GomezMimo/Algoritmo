var contador = 0;
var arregloProceso = [];
var ultimoProceso = 0;
var STFNoFlag = false;

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
		arregloProceso.push({numero_proceso: 'proceso ' + contador, orden_llegada: ordenLlegada, ocupacion_CPU: ocupacionCPU});
	} else {
		arregloProceso.forEach(function(proceso) {
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
	} else if(cambiarProceso === "STF No Expulsivo") {
		algoritmoNoExplusivo(tiempoEspera, tiempoOcupacion);
	}
}

function algoritmoFCFS(tiempoEspera, tiempoOcupacion) {	
	var tiempoTotal = 0;
	var esperaProceso = 0;
	var llegadaProceso = 0;
	var totalEspera = 0;
	var totalOcupacion = 0;
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
		tiempoTotal += proceso.ocupacion_CPU;
		ultimoProceso = proceso.ocupacion_CPU;
		esperaProceso = ((tiempoTotal - proceso.orden_llegada) - ultimoProceso);
		llegadaProceso = (tiempoTotal - proceso.orden_llegada);
		if(esperaProceso < 0 ) {
			esperaProceso = 0;
		}
		tiempoEspera.innerHTML += "<p> <span class='contador-proceso'> " + proceso.numero_proceso + ":</span> " + esperaProceso + " segundos.</p>";
		tiempoOcupacion.innerHTML += "<p> <span class='contador-proceso'> " + proceso.numero_proceso + ":</span> " + llegadaProceso + " segundos.</p>";
		totalEspera += esperaProceso;
		totalOcupacion += llegadaProceso;
	});
	tiempoEspera.innerHTML += "<p> <span class='contador-proceso'>Promedio: </span>" + (totalEspera / arregloProceso.length).toFixed(2) + " segundos."; 
	tiempoOcupacion.innerHTML += "<p> <span class='contador-proceso'>Promedio: </span>" + (totalOcupacion / arregloProceso.length).toFixed(2) + " segundos."; 
}

function algoritmoNoExplusivo(tiempoEspera, tiempoOcupacion) {
	var primerObjeto;
	var tiempoTotal = 0;
	var esperaProceso = 0;
	var llegadaProceso = 0;
	var totalEspera = 0;
	var totalOcupacion = 0;
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

	if(arregloProceso.length > 1) {
		primerObjeto = arregloProceso[0];
		arregloProceso.shift();
		STFNoFlag = true;				
	}
	arregloProceso = arregloProceso.sort(function (a, b) {		
		if (a.ocupacion_CPU > b.ocupacion_CPU) {
	    	return 1;
	  	}
  		if (a.ocupacion_CPU < b.ocupacion_CPU) {
    		return -1;
  		}
  		return 0;
	});
	if(STFNoFlag) {
		arregloProceso.unshift(primerObjeto);
	}
	console.log(arregloProceso);		
	arregloProceso.forEach(function (proceso) {		
		tiempoTotal += proceso.ocupacion_CPU;
		ultimoProceso = proceso.ocupacion_CPU;
		esperaProceso = ((tiempoTotal - proceso.orden_llegada) - ultimoProceso);
		llegadaProceso = (tiempoTotal - proceso.orden_llegada);
		if(esperaProceso < 0 ) {
			esperaProceso = 0;
		}
		tiempoEspera.innerHTML += "<p> <span class='contador-proceso'> " + proceso.numero_proceso + ":</span> " + esperaProceso + " segundos.</p>";
		tiempoOcupacion.innerHTML += "<p> <span class='contador-proceso'> " + proceso.numero_proceso + ":</span> " + llegadaProceso + " segundos.</p>";
		totalEspera += esperaProceso;
		totalOcupacion += llegadaProceso;
	});
	tiempoEspera.innerHTML += "<p> <span class='contador-proceso'>Promedio: </span>" + (totalEspera / arregloProceso.length).toFixed(2); 
	tiempoOcupacion.innerHTML += "<p> <span class='contador-proceso'>Promedio: </span>" + (totalOcupacion / arregloProceso.length).toFixed(2); 
}

function algoritmoExplusivo() {
	
}

function algoritmoRoundRobin() {

}