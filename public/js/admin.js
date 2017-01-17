angular.module('administrador',['ngRoute', 'ngResource','appConf'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/homeAdmin',{
		templateUrl: 'templates/admin/roles.html',
		controller: 'HomeAdmCtrl'
	})
	.otherwise({redirectTo: '/homeAdmin'});
}])
.controller('HomeAdmCtrl',['$scope','$http','IngenieroFact', '$route', '$routeParams', 
	function($scope, $http, IngenieroFact,$route,$routeParams){
	$scope.nombre="";	
	$scope.mensaje = "";
	$scope.Permisos ={
		modulo: "",
		agregar: false,
		actualizar: false,
		borrar: false,
		ver: false,
		administrador: false
	};
	$scope.id_ingeniero= 0;

	IngenieroFact.get(function(data){
		$scope.Ingenieros = data.ings;
	});

	$scope.guardarPermisos = function(){
		// guarda los permisos modificados, se envian en JSON al server
		var idIngeniero = $scope.id_ingeniero; 
		var req = {
			method: 'POST',
			url: "http://"+IP_SERVIDOR+"/inventario/public/index.php/permisos/"+idIngeniero,
			data: $scope.Permisos
		}
		$http(req).success(function(data){
			if (data.msg == 1) {
				$scope.mensaje = "Datos guardados.";
			}else{
				$scope.mensaje = data.msg;
			}
		}).error(function(data){

		});
	}	
	
	$scope.seleccionar = function(){
			// traer permisos 
		var id = $scope.id_ingeniero;
		var moduloSeleccionado = $scope.Permisos.modulo;
		$scope.mensaje = "";
		
		$scope.Permisos ={
			modulo: moduloSeleccionado,
			agregar: false,
			actualizar: false,
			borrar: false,
			ver: false,
			administrador: false
		};
			
		var req = {
			method: 'GET',
			url: "http://"+IP_SERVIDOR+"/inventario/public/index.php/permisos/"+id,
			data: { test: 'test' }
			}
		$http(req).success(function(data){
			
			if (data.length>0){
				angular.forEach(data, function(valor, llave){
					if (valor.modulo == moduloSeleccionado){
						// Asignar los permisos a la variable de Scope Permisos para hacer binding con la pagina
						$scope.Permisos.agregar = (valor.agregar == 1)? true: false;
						$scope.Permisos.actualizar = (valor.upd == 1)? true: false;
						$scope.Permisos.borrar = (valor.del == 1)? true: false;
						$scope.Permisos.ver = (valor.ver == 1)? true: false;
						$scope.Permisos.administrador = (valor.admin == 1)? true: false;
					}
				});
			}
			
		}).error(function(){
			alert('error');
		});
	}

}]);
