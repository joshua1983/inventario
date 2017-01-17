<?php

/*
|--------------------------------------------------------------------------
| Rutas de la aplicacion
|--------------------------------------------------------------------------
|
| Aqui se registran todas las rutas del servicio REST. Todas devuelven JSON
|
*/


// Identificacion y gestion de permisos
Route::get('autenticar/{login}/{password}', 'HomeController@autenticar');
Route::post('login',"LoginController@login");
Route::post('getPermisos/{id}',"LoginController@getPermisos");

Route::controllers([
	'auth' => 'Auth\AuthController',
	'password' => 'Auth\PasswordController',
]);

/*
* Gestion de informes
*/
Route::get('informes',"InformesController@index");
Route::get('informes/{id}',"InformesController@getInforme")->where(array('id' => '[0-9]+'));

/*
* Gestiond de capacidades por modulo
*/
Route::get('capmod',"ModulosCapController@index");
Route::get('capmod/{id}',"ModulosCapController@modulos");
Route::put('capmod/{id}',"ModulosCapController@updateMod");
Route::put('updatemod/{id}',"ModulosCapController@updateModCap");
Route::get('updatemod/{id}',"ModulosCapController@getModuloCap");
Route::delete('capmod/del/{id}/{idCap}',"ModulosCapController@delMod");

/*
* Gestion de capacidades
*/
Route::get('capacidad/{id}',"CapacidadesController@getCapacidad");
Route::get('caracteristica/{id}',"CapacidadesController@getCaracteristica");
Route::get('caracteristica/nivel/{id}',"CapacidadesController@getCaracteristicaNivel");
Route::put('capacidad/{id}',"CapacidadesController@updateCap");
Route::post('caracteristica',"CapacidadesController@nuevaCaract");
Route::post('caracteristica/{id}',"CapacidadesController@updCaract"); 

Route::put('updatecaping/{id}',"ModulosCapController@updateIngCapacitado");
Route::put('updatecapfunc/{id}',"ModulosCapController@updateFuncCapacitado");

Route::get('capacidades',"CapacidadesController@index");
Route::get('capacidades/{id}',"CapacidadesController@modulos");
Route::get('capacidadesespecificas/{id}',"CapacidadesController@capacidadesEspecificas");
Route::post('capacidades/{id}',"CapacidadesController@asignarApp");
Route::put('capacidades/{id}',"CapacidadesController@updateApp");

Route::post('capacidades/mod/{id}',"CapacidadesController@asignarMod");
Route::delete('capacidades/del/{id}/{idCap}',"CapacidadesController@delApp");
Route::delete('capacidades/{id}',"CapacidadesController@delCap");
Route::delete('capacidadesp/{id}',"CapacidadesController@delCapEsp");
Route::post('capacidades',"CapacidadesController@storeCap");

/*
* Gestion de aplicaciones
*/
Route::get('aplicaciones',"AplicacionController@index");
Route::get('aplicaciones/{id}',"AplicacionController@show");
Route::post('aplicaciones',"AplicacionController@store");
Route::put('aplicaciones/{id}',"AplicacionController@update");
Route::delete('aplicaciones/{id}',"AplicacionController@destroy");
Route::get('entornosistema',"AplicacionController@getEntorno");

/*
* Gestion de ingenieros
*/
Route::get('ingenieros',"IngenierosController@index");
Route::get('ingenieros/{id}',"IngenierosController@show");
Route::get('ingenieros/{id}/{idApp}',"IngenierosController@showMod");
Route::get('ingenierosapps/{id}',"IngenierosController@getProyectos");
Route::post('ingenieros',"IngenierosController@store");
Route::post('ingenieros/{id}/{idApp}',"IngenierosController@storeMod");
Route::post('ingenieros/remove/{id}/{idApp}',"IngenierosController@removeMod");
Route::put('ingenieros/{id}',"IngenierosController@update");
Route::delete('ingenieros/{id}',"IngenierosController@destroy");


/*
* Gestion de funcionales
*/
Route::get('funcionales',"FuncionalesController@index");
Route::get('funcionales/{id}',"FuncionalesController@show");
Route::get('funcionales/{id}/{idApp}',"FuncionalesController@showMod");
Route::post('funcionales',"FuncionalesController@store");
Route::post('funcionales/{id}/{idApp}',"FuncionalesController@storeMod");
Route::post('funcionales/remove/{id}/{idApp}',"FuncionalesController@removeMod");
Route::put('funcionales/{id}',"FuncionalesController@update");
Route::delete('funcionales/{id}',"FuncionalesController@destroy");

Route::get('permisos/{id}',"LoginController@getPermisos");
Route::post('permisos/{id}',"LoginController@setPermisos");
/*
* Gestion de los modulos de las aplicaciones
*/
Route::get('modulos/',"ModulosController@index");
Route::get('modulos/{id}',"ModulosController@indexApp");
Route::get('modulos/{id}/{idApp}',"ModulosController@show");
Route::post('modulos',"ModulosController@store");
Route::put('modulos/{id}',"ModulosController@update");
Route::delete('modulos/{id}',"ModulosController@destroy");

/*
* Gestion de los servidores
*/
Route::get('configuraciones',"ConfiguracionController@index");
Route::get('configuraciones/{id}',"ConfiguracionController@show");
Route::post('configuraciones',"ConfiguracionController@store");
Route::put('configuraciones/{id}',"ConfiguracionController@update");
Route::delete('configuraciones/{id}',"ConfiguracionController@destroy");

// Asociar el servidor a la aplicacion
Route::post('configuraciones/add/{id}/{idApp}', "ConfiguracionController@asociar");
// Relacion servidor aplicaciones
Route::get('configuraciones/app/{idApp}',"ConfiguracionController@showConfig");
Route::delete('configuraciones/app/{id}',"ConfiguracionController@delAppConfig");
Route::get('configuraciones/apps/{id}',"ConfiguracionController@showApp");


/*
* Gestion de logs de las aplicaciones
*/
Route::get('log/{id}',"LogsController@indexLog");
Route::get('logs/{id}',"LogsController@showLogs");
Route::get('logs',"LogsController@index");
Route::post('logs/{id}',"LogsController@storeLog");
Route::put('log/{id}',"LogsController@update");
Route::delete('logs/{id}',"LogsController@destroy");

Route::post("mantenimiento/{ip}","LogsController@guardarMantenimiento");

// visor externo
Route::get('visorlog/{fecha_i}/{fecha_f}/{app}',"LogsController@verlogs");
