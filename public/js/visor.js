function calcularTiempo(FechaInicial, FechaFinal){
	
	var tiempoDif = moment(FechaFinal,"YYYY-MM-DD HH24:mm:ss")
					.diff(moment(FechaInicial, "YYYY-MM-DD HH24:mm:ss"), 'minutes') + " minutos";

	if (parseInt(tiempoDif) > 1440){
		tiempoDif = moment(FechaFinal,"YYYY-MM-DD HH24:mm:ss")
					.diff(moment(FechaInicial, "YYYY-MM-DD HH24:mm:ss"), 'days') + " dias";
	}
	
	return tiempoDif;
}

angular.module('visor',['ngRoute', 'ngResource', 'ngSanitize'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/',{
		templateUrl: 'templates/reportes/visorTmpl.html',
		controller: 'HomeVisorCtrl'
	}).when('/:id',{
		templateUrl: 'templates/reportes/visorDetalle.html',
		controller: 'HomeDetalleCtr'
	})
}])
.controller('HomeDetalleCtr',['$scope','$routeParams','LogFactory',function($scope,$routeParams,LogFactory){
	if ($routeParams.id != undefined){
		var idLog = $routeParams.id;
		LogFactory.get({id:idLog},function(data){
			var tiempoSolucion = calcularTiempo(data.fecha_evento, data.fecha_resolucion);
			var html_mensaje = "<div><strong> Mensaje: </strong> "+ data.mensaje_publico + "</div> "
			+ " <div> <strong>Fecha-Hora Inicio:</strong>"+moment(data.fecha_evento,"YYYY-MM-DD HH24:mm:ss").format("YYYY/MM/DD hh:mm:ss a") + "</div>"
			+ " <div> <strong>Fecha-Hora Resolucion:</strong> "+moment(data.fecha_resolucion,"YYYY-MM-DD HH24:mm:ss").format("YYYY/MM/DD hh:mm:ss a") + "</div>"
			+ " <div> <strong>Duracion:</strong> "+tiempoSolucion + " </div>";
			$scope.mensajeDetalle = html_mensaje;
		});
	}
}])
.controller('HomeVisorCtrl',['$scope','$routeParams','InventarioApp','VisorFact', 'LogFactory', '$route', 
	function($scope, $routeParams, InventarioApp, VisorFact, LogFactory,$route){

	var conterDias = 0;
	var hoy = moment().format("DD-MM-YYYY");
	var html_imagen = '<img style="cursor:pointer" src="img/barra_red.gif" />';
	$scope.mensajeDetalle = "En esta página se proporciona información sobre el rendimiento de los servicios UNAB. Haga click en un evento para obtener mas información";
	
	$scope.fecha = new Array({},{},{},{});
	$scope.fecha[0].fechaEvento = moment().subtract(3, 'days').format("DD-MM-YYYY");
	$scope.fecha[1].fechaEvento = moment().subtract(2, 'days').format("DD-MM-YYYY");
	$scope.fecha[2].fechaEvento = moment().subtract(1, 'days').format("DD-MM-YYYY");
	$scope.fecha[3].fechaEvento = moment().format("DD-MM-YYYY");

	$scope.filtarEstado = function(app){
		if (app.estado == 1 || app.estado == 2){
			return true;
		}else{
			return false;
		}
	}
	

	$scope.loadData = function(){
		InventarioApp.get(function(data){
			$scope.aplicaciones = data.apps;
			angular.forEach($scope.aplicaciones,function(app,key){

				var idApp = app.id;
				app.logs = [{},{},{},{}];
				VisorFact.get({
					fecha_i: $scope.fecha[0].fechaEvento, 
					fecha_f: $scope.fecha[3].fechaEvento,
					app: idApp
				}, function(data){
					var m_fecha_0 = moment($scope.fecha[0].fechaEvento, "DD-MM-YYYY");
					var m_fecha_1 = moment($scope.fecha[1].fechaEvento, "DD-MM-YYYY");
					var m_fecha_2 = moment($scope.fecha[2].fechaEvento, "DD-MM-YYYY");
					var m_fecha_3 = moment($scope.fecha[3].fechaEvento, "DD-MM-YYYY");
					
					if (data.logs != undefined && data.logs.length > 0 ){
						data.logs.forEach(function(log){


							var m_fecha_evento = moment(log.fecha_evento.split(" ")[0], "YYYY-MM-DD");
							var m_fecha_resolucion = moment(log.fecha_resolucion.split(" ")[0], "YYYY-MM-DD");

							if (moment().isBetween(log.fecha_evento,log.fecha_resolucion)){
								app.barra_app = "<img src='img/barra_red.gif' />";
							}else{
								app.barra_app = "<img src='img/barra_green.gif' />";
							}

							if (m_fecha_evento.isSame(m_fecha_resolucion)){
								if (m_fecha_evento.isSame(m_fecha_0)){
									$("#data_"+app.id+"_0").html(
										$("#data_"+app.id+"_0").html() + 
										'<a href="#/'+log.logid+'" >' + html_imagen + '</a>'
									);
								}
								if (m_fecha_evento.isSame(m_fecha_1)){
									$("#data_"+app.id+"_1").html(
										$("#data_"+app.id+"_1").html() + 
										'<a href="#/'+log.logid+'" >' + html_imagen + '</a>'
									);
								}
								if (m_fecha_evento.isSame(m_fecha_2)){
									$("#data_"+app.id+"_2").html(
										$("#data_"+app.id+"_2").html() + 
										'<a href="#/'+log.logid+'" >' + html_imagen + '</a>'
									);
								}
								if (m_fecha_evento.isSame(m_fecha_3)){
									$("#data_"+app.id+"_3").html(
										$("#data_"+app.id+"_3").html() + 
										'<a href="#/'+log.logid+'" >' + html_imagen + '</a>'
									);
								}
							}else{
								if (m_fecha_evento.isSame(m_fecha_0)){
									$("#data_"+app.id+"_0").html(
										$("#data_"+app.id+"_0").html() + 
										'<a href="#/'+log.logid+'" >' + html_imagen + '</a>'
									);
								}
								if (m_fecha_evento.isSame(m_fecha_1)){
									$("#data_"+app.id+"_1").html(
										$("#data_"+app.id+"_1").html() + 
										'<a href="#/'+log.logid+'" >' + html_imagen + '</a>'
									);
								}
								if (m_fecha_evento.isSame(m_fecha_2)){
									$("#data_"+app.id+"_2").html(
										$("#data_"+app.id+"_2").html() + 
										'<a href="#/'+log.logid+'" >' + html_imagen + '</a>'
									);
								}
								if (m_fecha_evento.isSame(m_fecha_3)){
									$("#data_"+app.id+"_3").html(
										$("#data_"+app.id+"_3").html() + 
										'<a href="#/'+log.logid+'" >' + html_imagen + '</a>'
									);
								}
								if (m_fecha_resolucion.isBetween(m_fecha_0,m_fecha_3)){
									if (m_fecha_resolucion.isSame(m_fecha_0) || m_fecha_resolucion.isBefore(m_fecha_3)){
										$("#data_"+app.id+"_0").html(
											$("#data_"+app.id+"_0").html() + 
											'<a href="#/'+log.logid+'" >' + html_imagen + '</a>'
										);
									}
									if (m_fecha_resolucion.isSame(m_fecha_1) || m_fecha_resolucion.isBefore(m_fecha_3)){
										$("#data_"+app.id+"_1").html(
											$("#data_"+app.id+"_1").html() + 
											'<a href="#/'+log.logid+'" >' + html_imagen + '</a>'
										);
									}
									if (m_fecha_resolucion.isSame(m_fecha_2) || m_fecha_resolucion.isBefore(m_fecha_3)){
										$("#data_"+app.id+"_2").html(
											$("#data_"+app.id+"_2").html() + 
											'<a href="#/'+log.logid+'" >' + html_imagen + '</a>'
										);
									}
									if (m_fecha_resolucion.isSame(m_fecha_3)){
										$("#data_"+app.id+"_3").html(
											$("#data_"+app.id+"_3").html() + 
											'<a href="#/'+log.logid+'" >' + html_imagen + '</a>'
										);
									}
								}
							}

						});
						
					}
				});
			}, $scope.aplicaciones);
		});
	}

	$scope.loadData();

	$scope.siguiente = function(){
		conterDias += 4;
		$scope.fecha = new Array({},{},{},{});
		$scope.fecha[0].fechaEvento = moment().add(conterDias,'days').subtract(3, 'days').format("DD-MM-YYYY");
		$scope.fecha[1].fechaEvento = moment().add(conterDias,'days').subtract(2, 'days').format("DD-MM-YYYY");
		$scope.fecha[2].fechaEvento = moment().add(conterDias,'days').subtract(1, 'days').format("DD-MM-YYYY");
		$scope.fecha[3].fechaEvento = moment().add(conterDias,'days').format("DD-MM-YYYY");
		$scope.loadData();

	}

	$scope.anterior = function(){
		conterDias -= 4;
		$scope.fecha = new Array({},{},{},{});
		$scope.fecha[0].fechaEvento = moment().add(conterDias,'days').subtract(3, 'days').format("DD-MM-YYYY");
		$scope.fecha[1].fechaEvento = moment().add(conterDias,'days').subtract(2, 'days').format("DD-MM-YYYY");
		$scope.fecha[2].fechaEvento = moment().add(conterDias,'days').subtract(1, 'days').format("DD-MM-YYYY");
		$scope.fecha[3].fechaEvento = moment().add(conterDias,'days').format("DD-MM-YYYY");
		$scope.loadData();
	}

	$scope.reload = function(){
		$route.reload();
	}
}])
.factory('VisorFact',function($resource){
	$_token = "{{ csrf_token() }}";
	return $resource("http://"+IP_SERVIDOR+"/inventario/public/index.php/visorlog/:fecha_i/:fecha_f/:app",{fecha_i: "@fecha_i",fecha_f: "@fecha_f", app: "@app"} )
})
.factory('InventarioApp',function($resource){
	$_token = "{{ csrf_token() }}";
	return $resource("http://"+IP_SERVIDOR+"/inventario/public/index.php/aplicaciones/:id",{id: "@_id"},{
		update: {method: "PUT", params: {id: "@id", _token: $_token}}
	})
}).factory('LogFactory',function($resource){
	$_token = "{{ csrf_token() }}";
	return $resource("http://"+IP_SERVIDOR+"/inventario/public/index.php/log/:id",{id: "@_id"},{
		update: {method: "PUT", params: {id: "@id", _token: $_token}}
	})
});
