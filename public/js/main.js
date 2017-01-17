var G_PERMISOS = {};
var inventarioApplication = angular.module('inventario',
	['ngRoute','ngResource','ngAnimate','ng.httpLoader','appConf','administrador','inventarioApp','ingenieros','funcionales','modulos','informes','capacidades'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/loginPop',{
		templateUrl: 'templates/login.html',
		controller: 'LoginCtrl'
	});
}])
.controller('LoginCtrl',['$scope','$location', '$rootScope','AuthService', '$http', 
				function($scope, $location, $rootScope,AuthService, $http){

	$scope.usuario = "";
	$scope.password = "";
	$scope.resultado = "";
	$scope.autenticar = function(){
		$http({
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},
			url: "http://"+IP_SERVIDOR+"/inventario/public/index.php/login",
			data:{
					login: $scope.usuario,
					password: $scope.password
				}
		}).success(function(data){
			console.log(data);
			if (data.msg =! undefined && data.msg == "-1"){
				$scope.resultado = "Contraseña invalida";
			}
			if (data.hasOwnProperty("user")){
				AuthService.setData(data);
				if (AuthService.esAdmin()){
					$location.path('/homeAdmin');
				}else{
					$location.path('/homeApp');
				}

			}else{
				
			}
		}).error(function(data, status, headers, config){
			if (status == 500){
				$scope.resultado = "Contraseña invalida";
			}else{
				$scope.resultado = "Error: "+status;
			}
			
		});
	}

	$scope.isAdmin = function(){
		if (AuthService.esAdmin() == null ) return false;
		return AuthService.esAdmin();
	}
	$scope.estaAutenticado = function(){
		return AuthService.estaAutenticado();
	}

	$scope.salir = function(){
		AuthService.removeData(false);
		window.location.href= "http://"+IP_SERVIDOR+"/inventario/public/index.html";
	}

}])
.service('AuthService', function ($window) {
	var authService = {};

	authService.esAdmin = function(){
		var usuario = JSON.parse($window.sessionStorage.getItem('usuario'));
		if (usuario == undefined) return false;
		if (usuario.tipo== 1){
			return true;
		}else{
			return false;
		}
	}
	authService.setData= function(data){
		if (data != undefined ){
			$window.sessionStorage.setItem('usuario',JSON.stringify(data.user));
		}
	}
	authService.removeData= function(){
		if ($window.sessionStorage.getItem('usuario') != undefined){
			$window.sessionStorage.removeItem('usuario');
		}
	}
	authService.getPermisos = function(){
		if ($window.sessionStorage.getItem('usuario') != undefined){
			return JSON.parse($window.sessionStorage.getItem('usuario')).permisos;
		}
	}
	authService.estaAutenticado = function(){
		if ($window.sessionStorage.getItem('usuario') != undefined){
			return true;
		}
		else{
			return false;
		}
	}
	return authService;
})
.directive('dirRestriccion',['AuthService', 'removeElement','$window', function(AuthService, removeElement, $window){
	return{
		restrict: 'E',
		scope: {
			modulo: "=",
			permiso: "=",
			opcion: "="
		},
		compile: function(element, attr, linker){
			var accesoConcedido =false;
			var permisos = AuthService.getPermisos() || G_PERMISOS;


			if (permisos != null && permisos != undefined && (permisos instanceof Array)){
				for(var i=0; i<permisos.length; i++){
					if (permisos[i].modulo == attr.modulo){
						if (attr.permiso == "agregar" && permisos[i].agregar=="1"){
								accesoConcedido = true;
						}	
						if (attr.permiso == "editar" && permisos[i].upd=="1"){
								accesoConcedido = true;
						}	
						if (attr.permiso == "borrar" && permisos[i].del=="1"){
								accesoConcedido = true;
						}	
						if (attr.permiso == "ver" && permisos[i].ver=="1"){
								accesoConcedido = true;
						}	
					}
				}
			//accesoConcedido = true;
			}else{
				accesoConcedido = false;
			}
			
			if (accesoConcedido == false){
				if (attr.opcion == "deshabilitar"){
					angular.forEach(element.children(), function(child){
						element.children(1).eq(0).children(1).attr('readonly',"readonly");
						element.children(1).eq(0).children(1).attr('disabled',"disabeld");
						element.children(1).eq(0).children(1).readOnly = true;
					});
				}
				if (attr.opcion == "borrar"){
					angular.forEach(element.children(), function(child){
						removeElement(child);
					});
				}
				
			}
		}	
	}	
}]).constant('removeElement',function(element){
	element && element.remove && element.remove();
});
