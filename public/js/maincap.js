angular.module('capacidades',['ngRoute','ngResource', 'inventarioApp','modulos'])
.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/homeCap',{
		templateUrl: 'templates/capacidades/canvascap.html',
		controller: 'HomeCtrlCap'
	})
	.when('/editAppCaract/:id/:nivel/:idCap', {
		templateUrl: 'templates/capacidades/editAppCat.html',
		controller: 'CambiarAppCar'
	})
	.when('/editModCaract/:id/:nivel/:idCap', {
		templateUrl: 'templates/capacidades/editModCat.html',
		controller: 'CambiarModCar'
	})
	.when('/addAppCaract',{
		templateUrl: 'templates/capacidades/addAppCar.html',
		controller: 'AddAppCar'
	})
	.when('/addModCaract',{
		templateUrl: 'templates/capacidades/addModCar.html',
		controller: 'AddModCar'
	})
	.when('/addCapacidad',{
		templateUrl: 'templates/capacidades/addCapacidad.html',
		controller: 'AddCapCtr'
	})
	.when('/editCapacidad/:id',{
		templateUrl: 'templates/capacidades/addCapacidad.html',
		controller: 'EditCapCtr'
	})
	.when('/addCaracteristica',{
		templateUrl: 'templates/capacidades/addCaracteristica.html',
		controller: 'AddCaractCtr'
	})
	.when('/editCaracteristica/:id',{
		templateUrl: 'templates/capacidades/addCaracteristica.html',
		controller: 'EditCaractCtr'
	})
	.when('/editAplicacionCap/:id',{
		templateUrl: 'templates/capacidades/editAppNivel.html',
		controller: 'EditAppCtrCap'
	})
	.when('/editModuloCap/:id',{
		templateUrl: 'templates/capacidades/editAppNivel.html',
		controller: 'EditModCtrCap'
	});
}])

.controller('EditModCtrCap',['$scope','$http', '$location','CapacidadesMod', '$routeParams','AuthService',
	function($scope, $http, $location,  CapacidadesMod, $routeParams, AuthService){

	var idCar = $routeParams.id;


	$scope.nivel = 0;


	CapacidadesMod.get({id:idCar}, function(data){
		$scope.nivel = data.nivel;
	})


	$scope.guardar=function(){

		$http.put('http://'+IP_SERVIDOR+'/inventario/public/index.php/updatemod/'+idCar,
			{  "nivel": $scope.nivel}).

			success(function(data, status, headers, config) {
    			$location.path('/homeCap');
  			}).
  			error(function(data, status, headers, config) {
  			});
	}

}])

.controller('EditAppCtrCap',['$scope','$http', '$location','CapacidadesApp','CaracteristicaNivel', '$routeParams','AuthService',
	function($scope, $http, $location, CapacidadesApp, CaracteristicaNivel, $routeParams, AuthService){

	var idCar = $routeParams.id;

	$scope.idApp = 0;
	$scope.nivel = 0;
	$scope.idCap = 0;

	CaracteristicaNivel.get({id:idCar}, function(data){
		$scope.idApp = data.aplicacion;
		$scope.idCap = data.capacidad;
		$scope.nivel = data.nivel;
	})

	$scope.guardar=function(){

		$http.put('http://'+IP_SERVIDOR+'/inventario/public/index.php/capacidades/'+$scope.idApp,
			{  "nivel": $scope.nivel, "especifica": $scope.idCap}).

			success(function(data, status, headers, config) {
    			$location.path('/homeCap');
  			}).
  			error(function(data, status, headers, config) {
    			
  			});
	}

}])


.controller('EditCaractCtr',['$scope','$http', '$location','CapacidadesApp','Caracteristica', '$routeParams','AuthService',
	function($scope, $http, $location, CapacidadesApp, Caracteristica, $routeParams, AuthService){

	var idCaract = $routeParams.id;
	$scope.nombre = "";
	$scope.capacidad_id = 0;
	$scope.nivel = 0;

	CapacidadesApp.get(function(data){
		$scope.capacidades = data.caps;
	});

	Caracteristica.get({id:idCaract},function(data){
		$scope.nombre = JSON.parse(data.car).nombre;
		$scope.capacidad_id = JSON.parse(data.car).capacidad_id;
		$scope.nivel = JSON.parse(data.car).nivel;

	});

	$scope.guardar = function(){
		$http.post('http://'+IP_SERVIDOR+'/inventario/public/index.php/caracteristica/'+idCaract,
			{
				"nombre": $scope.nombre,
				"capacidad_id": $scope.capacidad_id,
				"nivel": $scope.nivel
			}).
			success(function(data, status, headers, config) {
    			$location.path('/homeCap');
  			}).
  			error(function(data, status, headers, config) {
    			
  			});
	}

}])

.controller('AddCaractCtr',['$scope','$http', '$location','CapacidadesApp', '$route','AuthService',
	function($scope, $http, $location, CapacidadesApp, $route, AuthService){


	$scope.nombre = "";
	$scope.capacidad_id = 0;
	$scope.nivel = 0;

	CapacidadesApp.get(function(data){
		$scope.capacidades = data.caps;
	});

	$scope.guardar = function(){
		$http.post('http://'+IP_SERVIDOR+'/inventario/public/index.php/caracteristica',
			{
				"nombre": $scope.nombre,
				"capacidad_id": $scope.capacidad_id,
				"nivel": $scope.nivel
			}).
			success(function(data, status, headers, config) {
    			$location.path('/homeCap');
  			}).
  			error(function(data, status, headers, config) {
    			
  			});
	}

}])

.controller('EditCapCtr',['$scope','$http', '$location', '$routeParams','CapacidadesApp','Capacidad', '$route','AuthService',
	function($scope, $http, $location, $routeParams, CapacidadesApp, Capacidad, $route, AuthService){

	var idCap = $routeParams.id;

	Capacidad.get({id: idCap},function(data){
		$scope.cap = data.cap;
	});

	$scope.guardar = function(){

		Capacidad.update({id: idCap}, $scope.cap).$promise.then(function(data){
			if (data.msg){
				$location.path('/homeCap');
			}
		});
	}

}])

.controller('AddCapCtr',['$scope','$http', '$location','CapacidadesApp', '$route','AuthService',
	function($scope, $http, $location, CapacidadesApp, $route, AuthService){

	$scope.cap = {
		"nombre": ""
	};

	$scope.guardar = function(){
		$http.post('http://'+IP_SERVIDOR+'/inventario/public/index.php/capacidades', {"nombre": $scope.cap.nombre}).
			success(function(data, status, headers, config) {
    			$location.path('/homeCap');
  			}).
  			error(function(data, status, headers, config) {
    			
  			});
	}

}])

.controller('HomeCtrlCap',['$scope','$http', '$q', '$location','CapacidadesApp', '$route','AuthService',
	function($scope, $http, $q, $location, CapacidadesApp, $route, AuthService){


	$scope.evaluaciones = [];

	evaluarCap = function(){
		var sumatoria = 0;
		var media = 0;

		for (var i=0; i< $scope.evaluaciones.length; i++){
			sumatoria += $scope.evaluaciones[i];
		}

		media = Math.round(sumatoria / $scope.evaluaciones.length);
		//console.log($scope.evaluaciones);
	};



	CapacidadesApp.get(function(data){
		$scope.capacidades = data.caps;
	});

	$scope.isAdmin = function(){
		if (AuthService.esAdmin() == null ) return false;
		return AuthService.esAdmin();
	}


	$scope.getEvaluacion = function(id, nivel, lyApps, lyMods, nivelPersonaModulo, nivelPersonaAplicacion, idCap){
		/*
			Parametros:
				@id = id de la capacidad
				@Nivel = tomado de la bd cuando se crea el proceso
				@lyApps = tomado de la consulta general al pintar la pagina
				@lyMods = tomado de la consulta general al pintar la pagina


			Proceso de evaluacion:
			Proceso = tomado de la opcion al crear la capacidad especifica
				0: No existe procedimiento
				1[17%]: existe como AS-IS
				2[33%]: existe como TO-BE
			Aplicacion = Tomado al agregar una aplicacion/modulo
				0: no se ha agregado ninguna aplicacion/modulo
				1[17%]: Se agrego la aplicacion/modulo pero no se ha marcado como completamente soportada
				2[33%]: se agrego la aplicacion/modulo y esta marcada como completamente soportada
			Personal = Tomado si la aplicacion/modulo tiene un ingeniero y/o tecnico asignado
				0: no se ha asignado ni tecnico ni funcional
				1[17%]: tiene asignado tecnico o funcional o ambos pero alguno de los dos no esta capacitado
				2[33%]: tiene asignado ambos y ESTAN CAPACITADOS
			Max = 6 puntos = 100%
		*/
		var sumaNivel = nivel;
		var bandApps = 0;
		var li_retorno = 0;

		// verificacion de las aplicaciones y modulos


		for (var i=0; i<lyApps.length; i++){
			if (lyApps[i].pivot.nivel==0){
				bandApps--;
			}else{
				bandApps += lyApps[i].pivot.nivel;
			}
		}
		for (var j=0; j<lyMods.length; j++){
			if (lyMods[j].pivot.nivel==0){
				bandApps--;
			}else{
				bandApps += lyMods[j].pivot.nivel;
			}
		}

		if ( bandApps == (lyApps.length + lyMods.length)  && bandApps != 0){
			sumaNivel++;
		}

		if (bandApps == ((lyApps.length + lyMods.length)*2) && bandApps != 0){
			sumaNivel += 2;
		}

		if (lyApps.length > 0){
			sumaNivel = sumaNivel + nivelPersonaAplicacion;
		}
		if (lyMods.length > 0){
			sumaNivel = sumaNivel + nivelPersonaModulo;
		}

		

		if (sumaNivel == 0){
			li_retorno = 0;
		}
		if (sumaNivel == 1){
			li_retorno = 17;
		}
		if (sumaNivel == 2){
			li_retorno = 33;
		}
		if (sumaNivel == 3){
			li_retorno = 50;
		}
		if (sumaNivel == 4){
			li_retorno = 67;
		}
		if (sumaNivel == 5){
			li_retorno = 83;
		}
		if (sumaNivel == 6){
			li_retorno = 100;
		}

		$scope.evaluaciones.push(sumaNivel);

		return li_retorno;

	}

	$scope.borrarCap = function(idCap){
		if(confirm("Esta seguro de eliminar la categoria?")){
			$http.delete('http://'+IP_SERVIDOR+'/inventario/public/index.php/capacidades/'+idCap).

				success(function(data, status, headers, config) {
					if(status== 200){
	    				location.reload();
	    			}
	  			}).
	  			error(function(data, status, headers, config) {
	    			console.log(status);
	  			});
  		}
	}

	$scope.borrarCaracteristica = function(idCap){
		if(confirm("Esta seguro de eliminar la caracteristica?")){
			$http.delete('http://'+IP_SERVIDOR+'/inventario/public/index.php/capacidadesp/'+idCap).

				success(function(data, status, headers, config) {
					if(status== 200){
	    				location.reload();
	    			}
	  			}).
	  			error(function(data, status, headers, config) {
	    			console.log(status);
	  			});
  		}
	}

	$scope.borrarApp = function(idApp, idCap){
		if(confirm("Esta seguro de eliminar la aplicacion?")){
			$http.delete('http://'+IP_SERVIDOR+'/inventario/public/index.php/capacidades/del/'+idApp+'/'+idCap).

			success(function(data, status, headers, config) {
				if(status== 200){
    				location.reload();
    			}
  			}).
  			error(function(data, status, headers, config) {
    			console.log(status);
  			});
		}
		
	}

	$scope.borrarMod = function(idMod, idCap){
		$http.delete('http://'+IP_SERVIDOR+'/inventario/public/index.php/capmod/del/'+idMod+'/'+idCap).

			success(function(data, status, headers, config) {
				if(status== 200){
    				location.reload();
    			}
  			}).
  			error(function(data, status, headers, config) {
    			console.log(status);
  			});
	}

}])
.controller('AddModCar',['$scope','$http', '$routeParams', '$location','InventarioApp', 'CapacidadesApp', 'ModuloFact',
	function($scope, $http, $routeParams, $location, InventarioApp, CapacidadesApp, ModuloFact){

	$scope.idAplicacion = 0;
	$scope.idCapacidadEsp = 0;
	$scope.idModulo = 0;
	$scope.nivel = 0;

	InventarioApp.get(function(data){
		$scope.InventarioApp = data.apps;
	});

	CapacidadesApp.get(function(data){
		$scope.capacidades = data.caps;
	});

	ModuloFact.get(function(data){
		$scope.modulos = data.mods;
	});

	$scope.cambiaApp=function(){
		ModuloFact.get({id:$scope.idAplicacion},function(dataMods){
			$scope.modulos = dataMods.modulos;
		});
	};

	$scope.cambiaCar= function(){

		$http.get('http://'+IP_SERVIDOR+'/inventario/public/index.php/capacidadesespecificas/'+$scope.idCaracteriza).

			success(function(data, status, headers, config) {
				console.log(data);
    			$scope.especificas = data;
  			}).
  			error(function(data, status, headers, config) {
    			console.log(status);
  			});
	}


	$scope.guardar=function(){

		$http.post('http://'+IP_SERVIDOR+'/inventario/public/index.php/capacidades/mod/'+$scope.idModulo,
			{"nivel": $scope.nivel, "especifica": $scope.idCapacidadEsp, "aplicacion": $scope.idAplicacion, "nivel": $scope.nivel}).

			success(function(data, status, headers, config) {
    			$location.path('/homeCap');
  			}).
  			error(function(data, status, headers, config) {
    			console.log(status);
  			});
	}
}])
.controller('AddAppCar',['$scope','$http', '$routeParams', '$location','InventarioApp', 'CapacidadesApp',
	function($scope, $http, $routeParams, $location, InventarioApp, CapacidadesApp){

	$scope.idAplicacion = 0;
	$scope.idCaracteriza = 0;
	$scope.idCapacidadEsp = 0;
	$scope.nivel = 0;

	InventarioApp.get(function(data){
		$scope.InventarioApp = data.apps;
	});

	CapacidadesApp.get(function(data){
		$scope.capacidades = data.caps;
	});

	$scope.cambiaCar= function(){

		$http.get('http://'+IP_SERVIDOR+'/inventario/public/index.php/capacidadesespecificas/'+$scope.idCaracteriza).

			success(function(data, status, headers, config) {
				console.log(data);
    			$scope.especificas = data;
  			}).
  			error(function(data, status, headers, config) {
    			console.log(status);
  			});
	}


	$scope.guardar=function(){

		$http.post('http://'+IP_SERVIDOR+'/inventario/public/index.php/capacidades/'+$scope.idAplicacion,
			{ "caracteriza": $scope.idCaracteriza, "especifica": $scope.idCapacidadEsp, "nivel": $scope.nivel}).

			success(function(data, status, headers, config) {
    			$location.path('/homeCap');
  			}).
  			error(function(data, status, headers, config) {
    			console.log(status);
  			});
	}
}])
.controller('CambiarModCar',['$scope','$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){
	$scope.nivel = $routeParams.nivel;
	$scope.idMod = $routeParams.id;
	$scope.idCap = $routeParams.idCap;

	$scope.guardarCambio = function(){

		$http.put('http://'+IP_SERVIDOR+'/inventario/public/index.php/capmod/'+$scope.idMod, {"nivel": $scope.nivel, "capacidad": $scope.idCap}).
			success(function(data, status, headers, config) {
    			$location.path('/homeCap');
  			}).
  			error(function(data, status, headers, config) {
    			console.log(status);
  			});


	}
}])

.controller('CambiarAppCar',['$scope','$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){
	$scope.nivel = $routeParams.nivel;
	$scope.idApp = $routeParams.id;
	$scope.idCap = $routeParams.idCap;

	$scope.guardarCambio = function(){

		$http.put('http://'+IP_SERVIDOR+'/inventario/public/index.php/capacidades/'+$scope.idApp, {"nivel": $scope.nivel, "capacidad": $scope.idCap}).
			success(function(data, status, headers, config) {
    			$location.path('/homeCap');
  			}).
  			error(function(data, status, headers, config) {
    			console.log(status);
  			});


	}
}])

.factory('CapacidadesApp',function($resource){
	$_token = "{{ csrf_token() }}";
	return $resource("http://"+IP_SERVIDOR+"/inventario/public/index.php/capacidades/:id",{id: "@_id"},{
		update: {method: "PUT", params: {id: "@id", _token: $_token}}
	})
})
.factory('CapacidadesMod',function($resource){
	$_token = "{{ csrf_token() }}";
	return $resource("http://"+IP_SERVIDOR+"/inventario/public/index.php/updatemod/:id",{id: "@_id"},{
		update: {method: "PUT", params: {id: "@id", _token: $_token}}
	})
})
.factory('Capacidad',function($resource){
	$_token = "{{ csrf_token() }}";
	return $resource("http://"+IP_SERVIDOR+"/inventario/public/index.php/capacidad/:id",{id: "@_id"},{
		update: {method: "PUT", params: {id: "@id", _token: $_token}}
	})
})
.factory('Caracteristica',function($resource){
	$_token = "{{ csrf_token() }}";
	return $resource("http://"+IP_SERVIDOR+"/inventario/public/index.php/caracteristica/:id",{id: "@_id"},{
		update: {method: "PUT", params: {id: "@id", _token: $_token}}
	})
})
.factory('CaracteristicaNivel',function($resource){
	$_token = "{{ csrf_token() }}";
	return $resource("http://"+IP_SERVIDOR+"/inventario/public/index.php/caracteristica/nivel/:id",{id: "@_id"},{
		update: {method: "PUT", params: {id: "@id", _token: $_token}}
	})
});
