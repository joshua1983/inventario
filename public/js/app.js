angular.module('inventarioApp',['ngRoute','ui.bootstrap','ngAnimate', 'ngResource','appConf', 'inventario','logAplicaciones'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/homeApp',{
		templateUrl: 'templates/listApp.html',
		controller: 'HomeCtrl'
	})
	.when('/editApp/:id',{
		templateUrl: 'templates/editarApp.html',
		controller: 'EditCtrl'
	})
	.when('/createApp',{
		templateUrl: 'templates/nuevoApp.html',
		controller: 'CreateCtrl'
	})
	.when('/',{
		redirectTo: '/homeApp'
	})
	.otherwise({redirectTo: '/homeApp'});
}])

.controller('HomeCtrl',['$scope','InventarioApp', '$route', '$rootScope','AuthService', function($scope, InventarioApp, $route, $rootScope, AuthService){
	InventarioApp.get(function(data){
		$scope.InventarioApp = data.apps;

	});
	
	$scope.isAdmin = function(){
		if (AuthService.esAdmin() == null ) return false;
		return AuthService.esAdmin();
	}

	$scope.remove= function(id){
		InventarioApp.delete({id: id}).$promise.then(function(data){
			if (data.msg){
				$route.reload(); 
			}
		});
	}


}])
.controller('EditCtrl',['$scope','$http','InventarioApp' ,'Configuraciones', 'ConfiguracionesApp','ModuloFact','IngenieroFact','LogsFactory', '$routeParams', '$route',
 function($scope, $http, InventarioApp, Configuraciones, ConfiguracionesApp, ModuloFact, IngenieroFact, LogsFactory, $routeParams, $route){
	$scope.settings = {
		pageTitle: "Editar Aplicaci&oacute;n ",
		action: "Guardar",
		edicion: true
	}

	var idAplicacion = $routeParams.id;
	
	
	InventarioApp.get({id:idAplicacion},function(data){
		IngenieroFact.get(function(datosIng){
			$scope.ingenieros = datosIng.ings;
		});
		
		ModuloFact.get({id:idAplicacion},function(dataMods){
			$scope.aplicacion.Modulos = dataMods.modulos;
		});
	
		ConfiguracionesApp.get({idApp: idAplicacion}, function(dataConf){
			$scope.aplicacion.Configuraciones = dataConf.config
		});

		LogsFactory.get({id:idAplicacion},function(dataLogs){
			$scope.aplicacion.Logs = dataLogs.logs;
		});

		$scope.aplicacion = data.aplicacion;
		
		var dba = $scope.aplicacion.dba_id;
		var tec = $scope.aplicacion.tec_id;	
		$scope.settings.pageTitle = "Editar Aplicacion " + $scope.aplicacion.nombre_aplicacion;	
		
		IngenieroFact.get({id:dba},function(datosIng){
			$scope.aplicacion.dba = datosIng.ingeniero;
		});
		IngenieroFact.get({id:tec},function(datosIng){
			$scope.aplicacion.tec = datosIng.ingeniero;
		});	
		
	});

	$scope.getPrincipal = function(data){

		var ret = $.grep(data, function(element, index){
			return element.pivot.principal==1;
		});
		if (ret[0] != undefined){
			return ret[0].nombres + " " + ret[0].apellidos;
		}else{
			return "No definido";
		}
		
	}
	$scope.actualizarCapacidad=function(idCap){

	}
	
	$scope.borrarConfiguracion= function(id){
		
		ConfiguracionesApp.delete({idApp: id}).$promise.then(function(data){
			if (data.msg){
				$route.reload(); 
			}
		});
		
		
/*
		var req = {
			 method: 'DELETE',
			 url: "http://"+IP_SERVIDOR+"/inventario/public/index.php/configuraciones/app/"+id,
			 data: { test: 'test' }
			}
		$http(req).success(function(){
			$route.reload(); 
		}).error(function(){
			alert('error');
		});
*/
	}
	
	$scope.borrarModulo= function(id){
		if(confirm("Esta seguro de eliminar el Modulo seleccionado?")){
			ModuloFact.delete({id: id}).$promise.then(function(data){
				if (data.msg){
					$route.reload(); 
				}
			});	
		}
		
	}

	$scope.submit = function(){
		InventarioApp.update({id: $scope.aplicacion.id}, $scope.aplicacion).$promise.then(function(data){
			if (data.msg){
				//angular.copy({},$scope.aplicacion);
				$scope.settings.success = "Aplicación editada correctamente";
				window.history.back();
			}
		});
	}
}])
.controller('CreateCtrl',['$scope', 'InventarioApp','IngenieroFact', '$location', function($scope, InventarioApp, IngenieroFact, $location){
	$scope.settings = {
		pageTitle: "Agregar Aplicación",
		action: "Crear",
		edicion: false
	}
	
	IngenieroFact.get(function(datosIng){
		$scope.ingenieros = datosIng.ings;
	});
	

	$scope.aplicacion = {
		codigo_aplicacion: "",
		nombre_aplicacion: "",
		nombre_visor: "",		
		dba_id: "",
		tec_id: "",
		estado: ""
	};

	$scope.submit = function(){
		
		InventarioApp.save($scope.aplicacion).$promise.then(function(data){
			if (data.msg){
				angular.copy({},$scope.aplicacion);
				$scope.settings.success = "Aplicación guardada correctamente";
				$location.path('homeApp');
			}
		});
	}
}])
.factory('InventarioApp',function($resource){
	$_token = "{{ csrf_token() }}";
	return $resource("http://"+IP_SERVIDOR+"/inventario/public/index.php/aplicaciones/:id",{id: "@_id"},{
		update: {method: "PUT", params: {id: "@id", _token: $_token}}
	})
})
.filter('FormatoFecha',function(){
	return function(input){
		moment.locale('es');
		return moment(input,"YYYY-MM-DD HH:mm:ss").format("DD - MMMM - YYYY - hh:mm:ss A")
	};
});
