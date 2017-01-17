angular.module('appConf',['ngRoute', 'ngResource','textAngular'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/homeConf',{
		templateUrl: 'templates/listConf.html',
		controller: 'HomeConfCtrl'
	})
	.when('/editConf/:id',{
		templateUrl: 'templates/editarConf.html',
		controller: 'EditConfCtrl'
	})
	.when('/createConf',{
		templateUrl: 'templates/nuevoConf.html',
		controller: 'CreateConfCtrl'
	})
	.when('/addConf/:idApp',{
		templateUrl: 'templates/listConf.html',
		controller: 'AddConfCtrl'
	})
	.otherwise({redirectTo: '/homeConf'});
}])
.controller('AddConfCtrl',['$scope', '$routeParams','$http','Configuraciones', '$route','$location', 
	function($scope, $routeParams, $http, Configuraciones,$route, $location){
		
	var id_aplicacion = $routeParams.idApp
	$scope.agregar = true;
	$scope.editar=false;

	Configuraciones.get(function(data){
		$scope.Configuraciones = data.config;
	});


	$scope.remove= function(id){
		if(confirm("Seguro desea eliminar el servidor?")){
			Configuraciones.delete({id: id}).$promise.then(function(data){
				if (data.msg){
					$route.reload(); 
				}
			});
		}
		
	}

	$scope.seleccionar = function(id){
		if (id_aplicacion != undefined || id_aplicacion != null){

			/*
			Agregar un servidor al modulo de aplicacion
			*/
			var path = $location.path();

			var req = {
				 method: 'POST',
				 url: "http://"+IP_SERVIDOR+"/inventario/public/index.php/configuraciones/add/"+id+"/"+id_aplicacion,
				 data: { test: 'test' }
				}
			$http(req).success(function(){
				path = path.replace("addConf","editApp");
				$location.path(path).replace();
			}).error(function(){
				alert('error');
			});

		}
	}
}])
.controller('HomeConfCtrl',['$scope','Configuraciones', '$route', function($scope, Configuraciones,$route){
	$scope.agregar = false;
	$scope.editar=true;
	Configuraciones.get(function(data){
		$scope.Configuraciones = data.config;
	});



	$scope.remove= function(id){
		if(confirm("Seguro desea eliminar el servidor?")){
			Configuraciones.delete({id: id}).$promise.then(function(data){
				if (data.msg){
					$route.reload(); 
				}
			});
		}
	}

}])
.controller('EditConfCtrl',['$scope','$http','Configuraciones', '$routeParams', function($scope, $http, Configuraciones, $routeParams){
	$scope.settings = {
		pageTitle: "Editar Configuracion",
		action: "Guardar"
	}
	$scope.notaServidor="..";

	var id = $routeParams.id;
	
	Configuraciones.get({id:id},function(data){
		$scope.Configuracion = data.config;

		var req = {
				method: 'GET',
				url: "http://"+IP_SERVIDOR+"/inventario/public/index.php/configuraciones/apps/"+id,
				dataType: 'json',
				data: { test: 'test' }
				}
		$http(req).success(function(data){
			$scope.Apps = data.apps;
		}).error(function(){
			alert('error');
		});
	}); 
	
	$scope.submit = function(){
		Configuraciones.update({id: $scope.Configuracion.id}, $scope.Configuracion).$promise.then(function(data){
			if (data.msg){
				//angular.copy({},$scope.Configuracion);
				$scope.settings.success = "Configuracion editada correctamente";
				window.history.back();
			}
		});
	}
}])
.controller('CreateConfCtrl',['$scope', 'Configuraciones', '$routeParams', '$location', function($scope, Configuraciones, $routeParams, $location){
	$scope.settings = {
		pageTitle: "Agregar Configuracion",
		action: "Crear"
	}
	
	$scope.Configuracion = {
		servidor: "",
		ip: "",
		so: "",
		nota: "",
		tipo:""
	};

	$scope.submit = function(){

		
		Configuraciones.save($scope.Configuracion).$promise.then(function(data){
			if (data.msg){
				angular.copy({},$scope.Configuracion);
				$scope.settings.success = "Configuracion guardada correctamente";
				window.history.back();
			}
		});
	}
}])
.factory('Configuraciones',function($resource){
	$_token = "{{ csrf_token() }}";
	return $resource("http://"+IP_SERVIDOR+"/inventario/public/index.php/configuraciones/:id/:idApp",{id: "@_id",idApp: "@_idApp"},{
		update: {method: "PUT", params: {id: "@id", _token: $_token}}
	})
})
.factory('ConfiguracionesApp',function($resource){
	$_token = "{{ csrf_token() }}";
	return $resource("http://"+IP_SERVIDOR+"/inventario/public/index.php/configuraciones/app/:idApp",{idApp: "@_idApp"},{
		update: {method: "PUT", params: {id: "@idApp", _token: $_token}}
	})
});;
