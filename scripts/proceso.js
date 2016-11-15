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
	dibujarGraficaProcesos();
}

function obtenerDatosProceso() {
	var ordenLlegada = Number(document.getElementById("llegada").value);
	var ocupacionCPU = Number(document.getElementById("ocupacion").value);
	contador++;
	if (isNaN(ordenLlegada) || isNaN(ocupacionCPU)) {
		contador--;
		alert("Por favor ingrese solo números");
		inicio();
	} else if (ordenLlegada < 0 || ocupacionCPU < 0) {
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
	var tiempoEspera = document.getElementById("tiempo-espera");
	var tiempoOcupacion = document.getElementById("tiempo-ocupacion");
	
	if (arregloProceso.length < 1) {
		arregloProceso.push({
			numero_proceso: 'proceso ' + contador,
			orden_llegada: ordenLlegada,
			ocupacion_CPU: ocupacionCPU
		});
	} else {
		arregloProceso.forEach(function(proceso) {
			if (proceso.orden_llegada === ordenLlegada) {
				procesoRepetido = true;
			}
		});
		if (procesoRepetido) {
			contador--;
			alert("Ya hay un proceso que ocupa ese espacio en memoria");
		} else {
			arregloProceso.push({
				numero_proceso: 'proceso ' + contador,
				orden_llegada: ordenLlegada,
				ocupacion_CPU: ocupacionCPU
			});
		}
	}
	
	if (cambiarProceso === 'FCFS') {
		algoritmoFCFS(tiempoEspera, tiempoOcupacion);
	} else if (cambiarProceso === 'STF No Expulsivo') {
		algoritmoNoExplusivo(tiempoEspera, tiempoOcupacion);
	} else if (cambiarProceso === 'STF Expulsivo') {
		algoritmoExplusivo(tiempoEspera, tiempoOcupacion);
	}
}

function algoritmoFCFS(tiempoEspera, tiempoOcupacion) {
	var tiempoTotal = 0;
	var esperaProceso = 0;
	var llegadaProceso = 0;
	var totalEspera = 0;
	var totalOcupacion = 0;
	
	tiempoEspera.innerHTML = "";
	tiempoOcupacion.innerHTML = "";
	
	arregloProceso = arregloProceso.sort(function(a, b) {
		if (a.orden_llegada > b.orden_llegada) {
			return 1;
		}
		if (a.orden_llegada < b.orden_llegada) {
			return -1;
		}
		return 0;
	});
	
	arregloProceso.forEach(function(proceso) {
		tiempoTotal += proceso.ocupacion_CPU;
		ultimoProceso = proceso.ocupacion_CPU;
		esperaProceso = ((tiempoTotal - proceso.orden_llegada) - ultimoProceso);
		llegadaProceso = (tiempoTotal - proceso.orden_llegada);
		
		if (esperaProceso < 0) {
			esperaProceso = 0;
		}
		
		tiempoEspera.innerHTML += '<p><span class="contador-proceso"><i class="fa fa-tasks" aria-hidden="true"></i> ' + proceso.numero_proceso + ':</span> ' + esperaProceso + ' segundos.</p>';
		tiempoOcupacion.innerHTML += '<p><span class="contador-proceso"><i class="fa fa-tasks" aria-hidden="true"></i> ' + proceso.numero_proceso + ':</span> ' + llegadaProceso + ' segundos.</p>';
		totalEspera += esperaProceso;
		totalOcupacion += llegadaProceso;
	});
	
	tiempoEspera.innerHTML += "<p><i class='fa fa-line-chart' aria-hidden='true'></i> <mark class='contador-proceso'>Promedio: </mark>" + (totalEspera / arregloProceso.length).toFixed(2) + " segundos.";
	tiempoOcupacion.innerHTML += "<p><i class='fa fa-line-chart' aria-hidden='true'></i> <mark class='contador-proceso'>Promedio: </mark>" + (totalOcupacion / arregloProceso.length).toFixed(2) + " segundos.";
	
	dibujarGraficaProcesos();
}

function algoritmoNoExplusivo(tiempoEspera, tiempoOcupacion) {
	var primerObjeto;
	var tiempoTotal = 0;
	var esperaProceso = 0;
	var llegadaProceso = 0;
	var totalEspera = 0;
	var totalOcupacion = 0;
	tiempoEspera.innerHTML = "";
	tiempoOcupacion.innerHTML = "";
	arregloProceso = arregloProceso.sort(function(a, b) {
		if (a.orden_llegada > b.orden_llegada) {
			return 1;
		}
		if (a.orden_llegada < b.orden_llegada) {
			return -1;
		}
		return 0;
	});
	
	if (arregloProceso.length > 1) {
		primerObjeto = arregloProceso[0];
		arregloProceso.shift();
		STFNoFlag = true;
	}
	arregloProceso = arregloProceso.sort(function(a, b) {
		if (a.ocupacion_CPU > b.ocupacion_CPU) {
			return 1;
		}
		if (a.ocupacion_CPU < b.ocupacion_CPU) {
			return -1;
		}
		return 0;
	});
	if (STFNoFlag) {
		arregloProceso.unshift(primerObjeto);
	}
	arregloProceso.forEach(function(proceso) {
		tiempoTotal += proceso.ocupacion_CPU;
		ultimoProceso = proceso.ocupacion_CPU;
		esperaProceso = ((tiempoTotal - proceso.orden_llegada) - ultimoProceso);
		llegadaProceso = (tiempoTotal - proceso.orden_llegada);
		if (esperaProceso < 0) {
			esperaProceso = 0;
		}
		tiempoEspera.innerHTML += "<p> <span class='contador-proceso'> " + proceso.numero_proceso + ":</span> " + esperaProceso + " segundos.</p>";
		tiempoOcupacion.innerHTML += "<p> <span class='contador-proceso'> " + proceso.numero_proceso + ":</span> " + llegadaProceso + " segundos.</p>";
		totalEspera += esperaProceso;
		totalOcupacion += llegadaProceso;
	});
	tiempoEspera.innerHTML += "<p> <span class='contador-proceso'>Promedio: </span>" + (totalEspera / arregloProceso.length).toFixed(2);
	tiempoOcupacion.innerHTML += "<p> <span class='contador-proceso'>Promedio: </span>" + (totalOcupacion / arregloProceso.length).toFixed(2);
	
	dibujarGraficaProcesos();
}

function algoritmoExplusivo(tiempoEspera, tiempoOcupacion) {
	var primerObjeto;
	var tiempoTotal = 0;
	var esperaProceso = 0;
	var llegadaProceso = 0;
	var totalEspera = 0;
	var totalOcupacion = 0;
	var actualTiempoEjecucion = 0;
	var procesoEnCola = 0;
	var procesosEnCola = [];
	var arregloProcesoExpulsivo = []; 
	var nuevoArreglo = [];
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
	arregloProceso.forEach(function (proceso, index) {			
		if(arregloProceso.length <= 1) {			
			if(esperaProceso < 0 ) {
				esperaProceso = 0;
			}
			tiempoEspera.innerHTML += "<p> <span class='contador-proceso'> " + proceso.numero_proceso + ":</span> " + esperaProceso + " segundos.</p>";
			tiempoOcupacion.innerHTML += "<p> <span class='contador-proceso'> " + proceso.numero_proceso + ":</span> " + llegadaProceso + " segundos.</p>";
			totalEspera += esperaProceso;
			actualTiempoEjecucion = proceso.ocupacion_CPU;
			procesoEnCola = Math.abs(actualTiempoEjecucion - proceso.orden_llegada);
			totalOcupacion += llegadaProceso;
		} else {										
			if(actualTiempoEjecucion > proceso.orden_llegada) {
				procesoEnCola = Math.abs(actualTiempoEjecucion - proceso.orden_llegada);
				procesosEnCola.push({
					indice: "proceso " + index,				
					proceso_en_cola: procesoEnCola
				});											
			}									
			actualTiempoEjecucion = proceso.ocupacion_CPU + proceso.orden_llegada;
			esperaProceso = ((tiempoTotal - proceso.orden_llegada) - ultimoProceso);
			llegadaProceso = (tiempoTotal - proceso.orden_llegada);
		}		
	});	
	/*console.table(arregloProceso);
	console.table(procesosEnCola);*/
	
	arregloProceso.forEach(function (proceso, index) { 		
		procesosEnCola.forEach(function (cola) {
			var a = cola.indice;
			var b = proceso.numero_proceso;						
			if(a == b) {								
				proceso.espera = proceso.ocupacion_CPU - cola.proceso_en_cola;
				arregloProcesoExpulsivo.push({
					numero_proceso: proceso.numero_proceso,
					orden_llegada: proceso.orden_llegada,
					ocupacion_CPU: proceso.ocupacion_CPU,
					espera: (proceso.ocupacion_CPU - proceso.espera)
				});
			} 			
		});
		if(proceso.espera === undefined) {
			proceso.espera = proceso.ocupacion_CPU;			
		}		
	});
	var copiaArreglo = arregloProceso;
	console.clear();
	//console.table(copiaArreglo);	
	//comparacionProcesos(arregloProcesoExpulsivo);	
	var banderaDivisionProcesos;	
	var arrayIndices = [];
	arregloProceso.forEach(function (proceso, index) {
		var banderaDivisionProcesos = false;
		arregloProcesoExpulsivo.forEach(function(procesoExpulsivo) {						
			if(proceso.numero_proceso == procesoExpulsivo.numero_proceso) {
				banderaDivisionProcesos = true;
			}			
		});			
		if(!banderaDivisionProcesos) {
			nuevoArreglo.push(proceso);
			if(arregloProcesoExpulsivo.length > 1) { 	
				arrayIndices.push(index);		
			}			
		}
	});
	//console.log("--------------");
	////console.table(nuevoArreglo);
	nuevoArreglo.forEach(function(proceso) {
		arregloProcesoExpulsivo.push(proceso);
	});
	//console.table(arregloProcesoExpulsivo);
	//console.log("--------------");
	//console.log(arrayIndices);
	console.table(arregloProcesoExpulsivo);
	separacionAlgoritmos(arregloProcesoExpulsivo, arregloProceso, arrayIndices);	
}

function separacionAlgoritmos(arregloExpulsivo, arregloProceso, arrayIndices) {	
	console.log("*******");
	console.log(arrayIndices);
	var nuevoArregloProcesos = arregloProceso.slice();
	//console.table(nuevoArregloProcesos);	
	for(var i = 0; i <= nuevoArregloProcesos.length; i++) {
		console.log(arrayIndices[i]);
		if(arrayIndices[i] != undefined && nuevoArregloProcesos.length > 1){
			console.table(nuevoArregloProcesos);
			console.log("este es el indice que serà borrado -> " + arrayIndices[i]);
			nuevoArregloProcesos = nuevoArregloProcesos.splice(arrayIndices[i], 1);				
		} 			
		//
		
	} 
	console.table(nuevoArregloProcesos);
}


function algoritmoRoundRobin() {
	
}

/**
 * Identifica el arreglo de procesos actual y genera una grafica que visualiza como se
 * comportarian los procesos.
 */
function dibujarGraficaProcesos() {
	var grafica = document.querySelector('#graphic-process');
	var segundosEspera = 0;
	grafica.innerHTML = '';
	
	arregloProceso.forEach(function(proceso) {
		var slots = getSlots('slot-vacio', segundosEspera) + getSlots('slot-ocupado', proceso.ocupacion_CPU, segundosEspera);
		var filaProceso = '<div class="row">' +
			'<div class="col-xs-2"><strong><i class="fa fa-tasks" aria-hidden="true"></i> ' + proceso.numero_proceso + '</strong></div>' +
			'<div class="col-xs-10">' + slots + '</div>' +
			'</div>';
		
		segundosEspera += proceso.ocupacion_CPU;
		grafica.innerHTML += filaProceso;
	});
}

/**
 * Obtiene una determinada cantidad de slots como un solo String
 * @param tipoSlot
 * @param numeroSlots
 * @param conteoInicial
 * @returns {string}
 */
function getSlots(tipoSlot, numeroSlots, conteoInicial) {
	var slots = Array(numeroSlots).fill('');
	
	return slots.map(function(slot, indice) {
		indice = (conteoInicial) ? conteoInicial + indice : indice;
		return '<div class="' + tipoSlot + '">' + indice + '</div>'
	}).join('');
}