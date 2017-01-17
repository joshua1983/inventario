angular.module('modulos',['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/homeMod/:id',{
		templateUrl: 'templates/listMod.html',
		controller: 'HomeModCtrl'
	})
	.when('/editMod/:id',{
		templateUrl: 'templates/editMod.html',
		controller: 'EditModCtrl'
	})
	.when('/addMod/:id',{
		templateUrl: 'templates/nuevoMod.html',
		controller: 'CreateModCtrl'
	})
	.otherwise({redirectTo: '/homeApp'});
}])

.controller('HomeModCtrl',['$scope','ModuloFact', '$routeParams', '$route', function($scope, ModuloFact, $routeParams,$route){
	
	var idApp = $routeParams.id;
	
	ModuloFact.get({id:id},function(data){
		$scope.Modulos = data.mods;
	});

	$scope.remove= function(id){
		ModuloFact.delete({id: id}).$promise.then(function(data){
			if (data.msg){
				$route.reload(); 
			}
		});
	}
}])
.controller('EditModCtrl',['$scope','ModuloFact','IngenieroFact', 'FuncionalFact', '$location', '$routeParams','$http', '$route', 
	function($scope, ModuloFact, IngenieroFact, FuncionalFact, $location, $routeParams, $http, $route){
	$scope.settings = {
		pageTitle: "Editar Funcional",
		action: "Guardar",
		editar: true
	}
	var bandContIng = 0;
	var bandContFun = 0;

	var app_id = $routeParams.id;
	ModuloFact.get({id:0,idApp:app_id},function(data){		
		$scope.modulo = data.modulo;
	});
	
	IngenieroFact.get({id:0,idApp:app_id},function(dataIng){
		$scope.ingenieros = dataIng.ingeniero;
	})
	
	FuncionalFact.get({id:0,idApp:app_id},function(dataFuncs){
		$scope.funcionales = dataFuncs.funcionales;
	});

	$scope.cambiaEstadoIng = function(id){
		var valor = $("#selCap"+id).val();
		var valorEsta = $("#selEstaIng"+id).val();
		var valorEstado = $("#selEstado"+id).val();

		var req = {
				 method: 'PUT',
				 url: "http://"+IP_SERVIDOR+"/inventario/public/index.php/updatecaping/"+id,
				 data: { 
				 	capacitado: valor, 
				 	principal: valorEsta,
				 	estado: valorEstado
				 }
			}
		$http(req).success(function(){
			$location.path('/editMod/'+app_id);
		}).error(function(){
			alert('error');
		});
	}

	$scope.cambiaCapacitaIng = function(id){
		var b_max_princ = false;
		
		
		for(var i=0; i< $scope.ingenieros.length; i++){
			var tmpID = $scope.ingenieros[i].pivot.id;
			var valorPrinc = $scope.ingenieros[i].pivot.principal;
			
			if (valorPrinc == "1"){
				if (bandContIng == 2){
					b_max_princ = true;
					break;
				}else{
					bandContIng++;
				}
				
			}
		}

		if (b_max_princ){
			alert("Solo puede existir un ingeniero principal");
		}else{
			var valor = $("#selCap"+id).val();
			var valorEsta = $("#selEstaIng"+id).val();
			var valorEstado = $("#selEstado"+id).val();

			var req = {
					 method: 'PUT',
					 url: "http://"+IP_SERVIDOR+"/inventario/public/index.php/updatecaping/"+id,
					 data: { 
					 	capacitado: valor, 
					 	principal: valorEsta,
				 		estado: valorEstado
					 }
				}
			$http(req).success(function(){
				$location.path('/editMod/'+app_id);
			}).error(function(){
				alert('error');
			});
		}


		
	}

	$scope.cambiaCapacitaFun = function(id){

		var b_max_princ = false;

		for(var i=0; i< $scope.funcionales.length; i++){
			var tmpID = $scope.funcionales[i].pivot.id;
			var valorPrinc = $scope.funcionales[i].pivot.principal;
			
			if (valorPrinc == "1"){
				if (bandContFun == 2){
					b_max_princ = true;
					break;
				}else{
					bandContFun++;
				}
				
			}
		}

		if (b_max_princ){
			alert("Solo puede existir un funcional principal");
		}else{
			var valor = $("#selFun"+id).val();
			var valorEsta = $("#selEstaFun"+id).val();
			var valorEstado = $("#selEstadoFun"+id).val(); 

			var req = {
				 method: 'PUT',
				 url: "http://"+IP_SERVIDOR+"/inventario/public/index.php/updatecapfunc/"+id,
				 data: { 
				 	capacitado: valor,
				 	principal: valorEsta,
				 	estado: valorEstado
				 	}
				}
			$http(req).success(function(){
				$location.path('/editMod/'+app_id);
			}).error(function(){
				alert('error');
			});
		}

		
	}
	
	$scope.borrarIngeniero = function(id){
		
		if(confirm("Esta seguro de eliminar el Ingeniero seleccionado?")){

			var req = {
				 method: 'POST',
				 url: "http://"+IP_SERVIDOR+"/inventario/public/index.php/ingenieros/remove/"+id+"/"+app_id,
				 data: { test: 'test' }
				}
			$http(req).success(function(){
				$route.reload(); 
			}).error(function(){
				alert('error');
			});
		}
	}
	
	$scope.borrarFuncional = function(id){
		if(confirm("Esta segudo de eliminar en Funcional seleccionado?")){
			var req = {
				 method: 'POST',
				 url: "http://"+IP_SERVIDOR+"/inventario/public/index.php/funcionales/remove/"+id+"/"+app_id,
				 data: { test: 'test' }
				}
			$http(req).success(function(){
				$route.reload(); 
			}).error(function(){
				alert('error');
			});
		}
	}
	
	$scope.submit = function(){
	
		ModuloFact.update({id: $scope.modulo.id}, $scope.modulo).$promise.then(function(data){
			if (data.msg){
				//angular.copy({},$scope.aplicacion);
				$scope.settings.success = "Ingeniero editado correctamente";
				window.history.back();
			}
		});
	}
}])
.controller('CreateModCtrl',['$scope', 'ModuloFact', '$routeParams','$location', 
	function($scope, ModuloFact, $routeParams, $location){
	$scope.settings = {
		pageTitle: "Agregar Funcional",
		action: "Crear",
		editar: false
	}

	$scope.modulo = {
		nombre_modulo: "",
		formularios: "",
		procesos: "",
		reportes: "",
		tablas: "",
		estado: "",
		tipomodulo: "",
		aplicacion_id: ""
	};

	$scope.submit = function(){
		$scope.modulo.aplicacion_id = $routeParams.id;
		ModuloFact.save($scope.modulo).$promise.then(function(data){
			if (data.msg){
				angular.copy({},$scope.modulo);
				$scope.settings.success = "Modulo guardado correctamente";
				$location.path('editApp/'+$routeParams.id);
			}
		});
	}
}])

.factory('ModuloFact',function($resource){
	$_token = "{{ csrf_token() }}";
	return $resource("http://"+IP_SERVIDOR+"/inventario/public/index.php/modulos/:id/:idApp",{id: "@_id",idApp:"@_idApp"},{
		update: {method: "PUT", params: {id: "@id", _token: $_token}}
	})
});
