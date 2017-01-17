angular.module('logAplicaciones',['ngRoute','ui.bootstrap','ngAnimate', 'ngResource','appConf', 'inventario', 'angular-date-picker-polyfill'])
.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/createLog/:idApp',{
		templateUrl: 'templates/nuevoLog.html',
		controller: 'CreateLogCtrl'
	})
	.when('/createLogServ/:servidor',{
		templateUrl: 'templates/nuevoLog.html',
		controller: 'CreateLogCtrl'
	})
	.when('/editLog/:id',{
		templateUrl: 'templates/editarLog.html',
		controller: 'EditLogCtrl'
	})
	.when('/',{
		redirectTo: '/homeApp'
	})
	.otherwise({redirectTo: '/homeApp'});
}])
.controller('CreateLogCtrl',['$scope','$route', '$routeParams', 'LogsFactory', 'LogMantenimiento', '$rootScope','$routeParams', 
	function($scope, $route, $routeParams, LogsFactory, LogMantenimiento, $rootScope, $routeParams){
	$scope.settings = {};
	
	var id_aplicacion = $routeParams.idApp;
	$scope.settings.action = "Crear";
	$scope.settings.success = "";
	$scope.settings.servidor = $routeParams.servidor;

	if ($scope.settings.servidor != 'undefined' && $scope.settings.servidor != ''){
		$scope.settings.action = "Crear Mantenimiento Servidor"
	}

	$scope.Log ={
		aplicacion_id : id_aplicacion,
		mensaje_publico : "",
		mensaje_privado : "",
		_fecha_evento : "",
		fecha_evento: "",
		nivel: 0,
		_fecha_resolucion: "",
		fecha_resolucion: ""
	}


	$scope.guardar = function(){
		var m_fecha_evento = moment($("#txtFechaEvento").val(),"DD/MM/YYYY hh:mm:ss A");
		var m_fecha_evento_fin = moment($("#txtFechaResolucion").val(),"DD/MM/YYYY hh:mm:ss A");
		var m_fecha_resolucion = moment($("#txtFechaResolucion").val(),"DD/MM/YYYY hh:mm:ss A");


		if ($scope.settings.servidor != 'undefined' && $scope.settings.servidor != ''){

			// Mantenimiento programado

			if (m_fecha_evento.isSame(m_fecha_evento_fin)){
				LogMantenimiento.save({id: $scope.settings.servidor},$scope.Log).$promise.then(function(data){
					if (data.msg){
						$scope.settings.success = "Programación guardada correctamente";
					}
				});
			}else{
				//m_fecha_evento.hour(6).minute(0).second(0);
				//m_fecha_evento_fin.hour(23).minute(59).second(59);

				var m_compare_inicio = m_fecha_evento;
				var m_compare_fin = m_fecha_evento_fin;

				//m_compare_inicio = m_compare_inicio.hour(23).minute(59).second(59);
				//m_compare_fin = m_compare_fin.hour(23).minute(59).second(59);
				//m_compare_fin = m_compare_fin.add(1,'days');

				console.log('fecha_evento:'+m_fecha_evento.format("YYYY-MM-DD HH:mm:ss"));
				console.log('fecha_resolucion:'+m_fecha_resolucion.format("YYYY-MM-DD HH:mm:ss"));

				do{
					var myLog ={
							mensaje_publico : $scope.Log.mensaje_publico,
							mensaje_privado : $scope.Log.mensaje_privado,
							fecha_evento: m_fecha_evento.format("YYYY-MM-DD HH:mm:ss"),
							nivel: $scope.Log.nivel,
							fecha_resolucion: m_fecha_resolucion.format("YYYY-MM-DD HH:mm:ss")
						};
					
					m_fecha_evento = m_fecha_evento.add(1,'days');
					//m_compare_inicio = m_compare_inicio.add(1,'days');

					console.log('fecha_evento:'+m_fecha_evento.format("YYYY-MM-DD HH:mm:ss"));
					console.log('fecha_resolucion:'+m_fecha_resolucion.format("YYYY-MM-DD HH:mm:ss"));


					LogMantenimiento.save({id: $scope.settings.servidor},myLog).$promise.then(function(data){
						if (data.msg){
							$scope.settings.success = "Programación guardada correctamente";
							//window.history.back();
						}
					});

				}while((m_fecha_evento.isBefore(m_compare_fin)));
		
			}



		}else{

			

			if (m_fecha_evento.isSame(m_fecha_resolucion)){
				LogsFactory.save({id: id_aplicacion},$scope.Log).$promise.then(function(data){
					if (data.msg){
						$scope.settings.success = "Programación guardada correctamente";
						//window.history.back();
					}
				});
			}else{
				m_fecha_evento.hour(6).minute(0).second(0);
				m_fecha_evento_fin.hour(23).minute(59).second(59);
				m_fecha_resolucion.hour(23).minute(59).second(59);

				m_fecha_resolucion = m_fecha_resolucion.add(1,'days');
				do{
					var myLog ={
							aplicacion_id : id_aplicacion,
							mensaje_publico : $scope.Log.mensaje_publico,
							mensaje_privado : $scope.Log.mensaje_privado,
							fecha_evento: m_fecha_evento.format("YYYY-MM-DD HH:mm:ss"),
							nivel: $scope.Log.nivel,
							fecha_resolucion: m_fecha_evento_fin.format("YYYY-MM-DD HH:mm:ss")
						};
					
					m_fecha_evento = m_fecha_evento.add(1,'days');
					m_fecha_evento_fin = m_fecha_evento_fin.add(1,'days');


					LogsFactory.save({id: id_aplicacion},myLog).$promise.then(function(data){
						if (data.msg){
							$scope.settings.success = "Programación guardada correctamente";
							//window.history.back();
						}
					});

				}while(!(m_fecha_evento_fin.isSame(m_fecha_resolucion)));
		
			}


		}
		
	}	

}])
.controller('EditLogCtrl',['$scope', 'LogFactory', '$routeParams','$route', '$http','$rootScope', 
	function($scope, LogFactory, $routeParams, $route, $http, $rootScope){
	$scope.settings = {
		pageTitle: "Editar Programación",
		action: "Guardar"
	}
	var id_log =  $routeParams.id;


	LogFactory.get({id:id_log},function(data){
		$scope.Log = data;
	});

	$scope.guardar = function (){
		console.log($scope.Log);
		LogFactory.update({id: id_log}, $scope.Log).$promise.then(function(data){
			if (data.msg){
				//angular.copy({},$scope.aplicacion);
				$scope.settings.success = "Log editado correctamente";
				//window.history.back();
			}
		});
	}

}])
.factory('LogsFactory',function($resource){
	$_token = "{{ csrf_token() }}";
	return $resource("http://"+IP_SERVIDOR+"/inventario/public/index.php/logs/:id",{id: "@_id"},{
		update: {method: "PUT", params: {id: "@id", _token: $_token}}
	})
})
.factory('LogFactory',function($resource){
	$_token = "{{ csrf_token() }}";
	return $resource("http://"+IP_SERVIDOR+"/inventario/public/index.php/log/:id",{id: "@_id"},{
		update: {method: "PUT", params: {id: "@id", _token: $_token}}
	})
})
.factory('LogMantenimiento',function($resource){
	$_token = "{{ csrf_token() }}";
	return $resource("http://"+IP_SERVIDOR+"/inventario/public/index.php/mantenimiento/:id",{id: "@_id"},{
		update: {method: "PUT", params: {id: "@id", _token: $_token}}
	})
});

