<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;



class AplicacionController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		// Mostrar todas las aplicacion
		$aplicaciones = \App\Models\Aplicacion::get();


		$str_retorno = '{';
		$str_retorno = $str_retorno . ' "msg": "Success","apps": [';

		foreach($aplicaciones as $app){

			$localApp = \App\Models\Aplicacion::find($app["id"]);
			$localApp::with('modulos')->get();

			// Obtiene los modulos por aplicacion
			$ly_cantidad = $localApp->modulos->toArray();

			$cantidad_mods = count($ly_cantidad);

			// filtra los modulos en estado "produccion"
			$mod_prod = $localApp->modulos->filter(function($item){
				return ($item->estado == 1);
			})->values();

			$cantidad_mods_prod = count($mod_prod->toArray());

			// filtra los modulos en estado "implementacion"
			$mod_impl = $localApp->modulos->filter(function($item){
				return ($item->estado == 2);
			})->values();

			$cantidad_mods_impl = count($mod_impl->toArray());

			// filtra los modulos en estado "en retiro"
			$mod_en_ret = $localApp->modulos->filter(function($item){
				return ($item->estado == 3);
			})->values();

			$cantidad_mods_en_ret = count($mod_en_ret->toArray());

			// filtra los modulos en estado "retirados"
			$mod_ret = $localApp->modulos->filter(function($item){
				return ($item->estado == 4);
			})->values();

			$cantidad_mods_ret = count($mod_ret->toArray());	
			

			// filtra los modulos en estado "no funcionales"
			$mod_no_fun = $localApp->modulos->filter(function($item){
				return ($item->estado == 5);
			})->values();

			$cantidad_mods_no_fun = count($mod_no_fun->toArray());		

			// filtra los modulos en estado "no utilizados"
			$mod_no_util = $localApp->modulos->filter(function($item){
				return ($item->estado == 6);
			})->values();

			$cantidad_mods_no_util = count($mod_no_util->toArray());	


			// Nombre de los ingenieros responsables de la aplicacion

			$nombreDBA = $this->getNombreIngeniero($app["dba_id"]);
			$nombreServ = $this->getNombreIngeniero($app["tec_id"]);


			// json de retorno
			$str_retorno = $str_retorno . ' {
				"id": '.$app["id"].',
				"dba_id": '. $app["dba_id"] .',
				"tec_id": '.$app["tec_id"].',
				"codigo_aplicacion": "'. $app["codigo_aplicacion"] .'",
				"nombre_aplicacion": "'.$app["nombre_aplicacion"].'",
				"nombre_visor": "'.$app["nombre_visor"].'",
				"nombre_dba": "'.$nombreDBA.'",
				"nombre_serv": "'.$nombreServ.'",
				"estado": "'.$app["estado"].'",
				"cant_mods": '.$cantidad_mods.',
				"cant_mods_prod": '.$cantidad_mods_prod.',
				"cant_mods_impl": '.$cantidad_mods_impl.',
				"cantidad_mods_ret": '.$cantidad_mods_ret.',
				"cantidad_mods_en_ret": '.$cantidad_mods_en_ret.',
				"cantidad_mods_no_util": '.$cantidad_mods_no_util.',
				"cantidad_mods_no_fun": '.$cantidad_mods_no_fun.',
				"barra_app": "<img src=\"img/barra_green.gif\" />"
				},';

		}

		if ($str_retorno != '{ "msg": "Success","apps": [')
			$str_retorno = substr($str_retorno, 0, -1);
		$str_retorno = $str_retorno . ']}';

		return response($str_retorno);

	}

	/*
	* Devuelve el nombre del ingeniero recibiendo el id
	*/
	private function getNombreIngeniero($idIng){

		$ingeniero = \App\Models\Ingeniero::find($idIng);

		if ($ingeniero!= null){
			return explode("@",$ingeniero->correo)[0];
		}else{
			return '-';
		}

		

	}
 
	/**
	 * Guardar aplicacion nueva, los datos vienen en el Request (enviados por json).
	 *
	 * @return Response
	 */
	public function store(Request $request)
	{
		$aplicacion = new \App\Models\Aplicacion();

		$aplicacion->codigo_aplicacion = $request->codigo_aplicacion;
		$aplicacion->nombre_aplicacion = $request->nombre_aplicacion;
		$aplicacion->nombre_visor = $request->nombre_visor;
		$aplicacion->dba_id = $request->dba_id;
		$aplicacion->tec_id = $request->tec_id;
		$aplicacion->estado = $request->estado;
		
		
		$aplicacion->save();

		return response()->json([
				"msg" => "Success",
				"id" => $aplicacion->id
			]
			);

	}

	/**
	 * Devuelve una aplicacion en formato JSON.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
		$aplicacion = \App\Models\Aplicacion::find($id);
		return response()->json([
				"msg" => "Success",
				"aplicacion" => $aplicacion
			]
			);
	}


	/**
	 * Actualiza la aplicacion. Los datos vienen en el Request por JSON y el id por URL.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update(Request $request, $id)
	{
		//
		$aplicacion = \App\Models\Aplicacion::find($id);

		$aplicacion->codigo_aplicacion = $request->codigo_aplicacion;
		$aplicacion->nombre_aplicacion = $request->nombre_aplicacion;
		$aplicacion->nombre_visor = $request->nombre_visor;
		$aplicacion->dba_id = $request->dba_id;
		$aplicacion->tec_id = $request->tec_id;
		$aplicacion->estado = $request->estado;

		$aplicacion->save();
		return response()->json([
				"msg" => "Success"
			],200
			);



	}

	/**
	 * Borra la aplicacion segun el ID.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
		$aplicacion = \App\Models\Aplicacion::find($id);
		$aplicacion->delete();
		return response()->json([
				"msg" => "Success"
			],200
			);
	}

}
