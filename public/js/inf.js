angular.module('informes',['ngRoute', 'ngResource','chart.js'])
.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/homeInf',{
	templateUrl: 'templates/pmu.html',
	controller: 'PmuCtrl'
	});
}])
.controller('PmuCtrl',['$scope','InformesFact', function($scope, InformesFact){

// Datos de ingenieros
	
	$scope.infFact = InformesFact.get({id:0},
					function(data){
						$scope.labelsIng = data.labels;
						$scope.seriesIng = ['Ingenieros'];
						$scope.dataIng = [	data.datos	];
						});

// Datos de aplicaciones	

	$scope.infApps = InformesFact.get({id:1},
					function(data){
						$scope.labelsApp = data.labelsApp;
						$scope.dataApp = 	data.datosApp	;
						
						});
	
// Tabla detalle
						
	$scope.infApps = InformesFact.get({id:2},
					function(data){
						$scope.dataIngModulos = data.registros;						
						});

	
}])
.factory('InformesFact',function($resource){
	$_token = "{{ csrf_token() }}";
	return $resource("http://"+IP_SERVIDOR+"/inventario/public/index.php/informes/:id");
});