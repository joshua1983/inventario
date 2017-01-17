angular.module('autenticacion',['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/homeCap',{
		templateUrl: 'templates/listFunc.html',
		controller: 'HomeFuncCtrl'
	})
	.when('/editCap/:id',{
		templateUrl: 'templates/editFunc.html',
		controller: 'EditFuncCtrl'
	})
	.when('/createCap',{
		templateUrl: 'templates/nuevoFunc.html',
		controller: 'CreateFuncCtrl'
	})
	.when('/createCapEsp',{
		templateUrl: 'templates/nuevoFunc.html',
		controller: 'CreateFuncCtrl'
	})
	.otherwise({redirectTo: '/homeCap'});
}])
.controller('AddFuncCtrl',['$scope','FuncionalFact', '$route', '$routeParams','$http', function($scope, FuncionalFact,$route, $routeParams, $http){
	FuncionalFact.get(function(data){
		$scope.Funcionales = data.funcs;
	});
	
	$scope.agregar=true; 
	
	var appId = $routeParams.idApp;
	
	$scope.seleccionar = function(id){
		var req = {
			 method: 'POST',
			 url: "http://"+IP_SERVIDOR+"/inventario/public/index.php/funcionales/"+id+"/"+appId,
			 data: { test: 'test' }
			}
		$http(req).success(function(){
			window.location.href = '/inventario/index.html#/editMod/'+appId;
		}).error(function(){
			alert('error');
		});
	}

	$scope.remove= function(id){
		FuncionalFact.delete({id: id}).$promise.then(function(data){
			if (data.msg){
				$route.reload(); 
			}
		});
	}
}])
.controller('HomeFuncCtrl',['$scope','FuncionalFact', '$route', function($scope, FuncionalFact,$route){
	FuncionalFact.get(function(data){
		$scope.Funcionales = data.funcs;
	});
	
	$scope.editar=true; 

	$scope.remove= function(id){
		FuncionalFact.delete({id: id}).$promise.then(function(data){
			if (data.msg){
				$route.reload(); 
			}
		});
	}
}])
.controller('EditFuncCtrl',['$scope','FuncionalFact', '$routeParams', '$route', function($scope, FuncionalFact, $routeParams, $route){
	$scope.settings = {
		pageTitle: "Editar Funcional",
		action: "Guardar"
	}

	var id = $routeParams.id;
	FuncionalFact.get({id:id},function(data){		
		$scope.funcional = data.funcional;
	});
	
	$scope.submit = function(){
	
		FuncionalFact.update({id: $scope.funcional.id}, $scope.funcional).$promise.then(function(data){
			if (data.msg){
				//angular.copy({},$scope.aplicacion);
				$scope.settings.success = "Ingeniero editado correctamente";
				window.history.back();
			}
		});
	}
}])
.controller('CreateFuncCtrl',['$scope', 'FuncionalFact','$route', function($scope, FuncionalFact, $route){
	$scope.settings = {
		pageTitle: "Agregar Funcional",
		action: "Crear"
	}

	$scope.funcional = {
		nombres: "",
		apellidos: "",
		correo: "",
		telefono: "",
		extension: ""
	};

	$scope.submit = function(){
		
		FuncionalFact.save($scope.funcional).$promise.then(function(data){
			if (data.msg){
				angular.copy({},$scope.funcional);
				$scope.settings.success = "Funcional guardado correctamente";
				window.history.back();
			}
		});
	}
}])

.factory('FuncionalFact',function($resource){
	$_token = "{{ csrf_token() }}";
	return $resource("http://"+IP_SERVIDOR+"/inventario/public/index.php/funcionales/:id/:idApp",{id: "@_id",idApp: "@_idApp"},{
		update: {method: "PUT", params: {id: "@id", _token: $_token}}
	})
});
