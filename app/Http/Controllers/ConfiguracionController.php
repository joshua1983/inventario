<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use DB;



class ConfiguracionController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		// Mostrar todas las aplicaciones
		$config = \App\Models\Configuracion::get();

		return response()->json([
				"msg" => "Success",
				"config" => $config->toArray()
			]
			);
	}
 
	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store(Request $request)
	{
		$config = new \App\Models\Configuracion();

		$config->servidor = $request->servidor;
		$config->ip = $request->ip;
		$config->so = $request->so;
		$config->nota= $request->nota;
		$config->tipo= $request->tipo;

		$config->save();

		return response()->json([
				"msg" => "Success",
				"id" => $config->id
			]
			);

	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
		$config = \App\Models\Configuracion::find($id);
		return response()->json([
				"msg" => "Success",
				"config" => $config
			]
			);
	}

	/*
	* Consultar las aplicaciones relacionadas con el servidor
	*/
	public function showApp($id){
		$sqlSelect = "select a.id, a.nombre_aplicacion from aplicaciones a, configuraciones b, configuraciones_aplicaciones c where a.id = c.aplicacion_id and b.id = c.configuracion_id and b.id=?";

		$ly_datos = array();
		$registros = \DB::select($sqlSelect, array($id));
	
		foreach ($registros as $fila){
			array_push($ly_datos, $fila);
		}
		return response()->json([
			"apps" => $ly_datos
		]);
	}
	
	public function showConfig($idApp){

		$sqlSelect = "select b.id, b.configuracion_id, servidor, ip, so, nota, tipo from configuraciones a,
		 configuraciones_aplicaciones b where b.aplicacion_id = ? and b.configuracion_id = a.id";

		$ly_datos = array();
		$registros = \DB::select($sqlSelect, array($idApp));
	
		foreach ($registros as $fila){
			array_push($ly_datos, $fila);
		}
		return response()->json([
			"config" => $ly_datos
		]);
		
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update(Request $request, $id)
	{
		//
		$config = \App\Models\Configuracion::find($id);

		$config->servidor = $request->servidor;
		$config->ip = $request->ip;
		$config->so = $request->so;
		$config->nota= $request->nota;
		$config->tipo= $request->tipo;

		$config->save();
		return response()->json([
				"msg" => "Success"
			],200
			);



	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
		$config = \App\Models\Configuracion::find($id);
		$config->delete();
		return response()->json([
				"msg" => "Success"
			],200
			);
	}

	/**
	 * Eliminar el servidor asociado a una aplicacion
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function delAppConfig($id)
	{
		//
		$sqlDelete = "delete from configuraciones_aplicaciones where id = ?";
		DB::delete($sqlDelete, array($id));
		return '{"msg": 1}';

	}

	/**
	* Asociar el id del servidor con la aplicacion seleccionada
	* @param int $id
	* @param int $idApp
	* @return Response
	*/

	public function asociar($id, $idApp){
		$sqlInsert = "insert into configuraciones_aplicaciones(aplicacion_id, configuracion_id) values (?,?)";
		DB::statement(
			DB::raw(
				$sqlInsert
				),array($idApp,$id)
			);
		return '{"msg": 1}';
	}

}
