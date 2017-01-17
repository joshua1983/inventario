angular.module('ingenieros',['ngRoute', 'ngResource','appConf'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/homeIng',{
		templateUrl: 'templates/listIng.html',
		controller: 'HomeIngCtrl'
	})
	.when('/editIng/:id',{
		templateUrl: 'templates/editIng.html',
		controller: 'EditIngCtrl'
	})
	.when('/createIng',{
		templateUrl: 'templates/nuevoIng.html',
		controller: 'CreateIngCtrl'
	})
	.when('/addIng/:idApp',{
		templateUrl: 'templates/listIng.html',
		controller: 'AddIngCtrl'
	})
	.otherwise({redirectTo: '/homeIng'});
}])
.controller('AddIngCtrl',['$scope','$http','IngenieroFact', '$route', '$routeParams', 
	function($scope, $http, IngenieroFact,$route,$routeParams){
	IngenieroFact.get(function(data){
		$scope.Ingenieros = data.ings;
	});
	
	$scope.agregar=true; 
	
	var appId = $routeParams.idApp;

	
	
	$scope.seleccionar = function(id){
		var req = {
			 method: 'POST',
			 url: "http://"+IP_SERVIDOR+"/inventario/public/index.php/ingenieros/"+id+"/"+appId,
			 data: { test: 'test' }
			}
		$http(req).success(function(){
			window.location.href = '/inventario/index.html#/editMod/'+appId;
		}).error(function(){
			alert('error');
		});
	}

}])
.controller('HomeIngCtrl',['$scope','IngenieroFact', '$route','AuthService', function($scope, IngenieroFact,$route,AuthService){
	$scope.editar=true;
	
	IngenieroFact.get(function(data){
		$scope.Ingenieros = data.ings;
	});

	$scope.isAdmin = function(){
		if (AuthService.esAdmin() == null ) return false;
		return AuthService.esAdmin();
	}

	
	$scope.remove= function(id){
		IngenieroFact.delete({id: id}).$promise.then(function(data){
			if (data.msg){
				window.history.back();
			}
		});
	}
}])
.controller('EditIngCtrl',['$scope','IngenieroFact','Configuraciones', '$routeParams','$route', '$http', 
	function($scope, IngenieroFact, Configuraciones, $routeParams, $route, $http){

	$scope.settings = {
		pageTitle: "Editar Ingeniero",
		action: "Guardar"
	}

	var id = $routeParams.id;
	IngenieroFact.get({id:id},function(data){
		
		$scope.ingeniero = data.ingeniero;


		$scope.ingeniero.trabajasi = ($scope.ingeniero.trabajasi == 1) ;
		$scope.ingeniero.trabajati = ($scope.ingeniero.trabajati == 1) ;
		
		var req = {
			 method: 'GET',
			 url: "http://"+IP_SERVIDOR+"/inventario/public/index.php/ingenierosapps/"+id,
			 data: { test: 'test' }
			}
		$http(req).success(function(data){
			$scope.ingeniero.aplicaciones = data.registros;
		}).error(function(){
			alert('error');
		});
		
	});
	
	

	$scope.submit = function(){
	
		IngenieroFact.update({id: $scope.ingeniero.id}, $scope.ingeniero).$promise.then(function(data){
			if (data.msg){
				//angular.copy({},$scope.aplicacion);
				$scope.settings.success = "Ingeniero editado correctamente";
				window.history.back();
			}
		});
	}
}])
.controller('CreateIngCtrl',['$scope', 'IngenieroFact', '$route', function($scope, IngenieroFact, $route){
	$scope.settings = {
		pageTitle: "Agregar Ingeniero",
		action: "Crear"
	}

	$scope.ingeniero = {
		nombres: "",
		apellidos: "",
		correo: "",
		telefono: "",
		celular: "",
		extension: "",
		trabajasi: false,
		trabajati: false
	};

	$scope.submit = function(){

		if ($scope.ingeniero.nombres == ""){
			alert("Debe escribir un nombre");
			return;
		}
		
		IngenieroFact.save($scope.ingeniero).$promise.then(function(data){
			if (data.msg){
				angular.copy({},$scope.ingeniero);
				$scope.settings.success = "Ingeniero guardada correctamente";
				window.history.back();
			}
		});
	}
}])

.factory('IngenieroFact',function($resource){
	$_token = "{{ csrf_token() }}";
	return $resource("http://"+IP_SERVIDOR+"/inventario/public/index.php/ingenieros/:id/:idApp",{id: "@_id", idApp: "@_idApp"},{
		update: {method: "PUT", params: {id: "@id", _token: $_token}}
	})
});
