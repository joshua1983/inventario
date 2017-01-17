<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use DB;


class LogsController extends Controller {
	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{

		return response()->json("{}");
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function indexLog($id)
	{
		// Mostrar el log seleccioando
		$logs = \App\Models\LogAplicaciones::find($id);

		return response()->json($logs);
	}

	/**
	*  Visor de los logs de las aplicaciones
	*/

	public function verlogs($fecha_i, $fecha_f, $app){
		DB::connection()->enableQueryLog();   

		$fecha_inicial = $fecha_i;
		$fecha_final = $fecha_f;


		$sqlSelect = "

				select * from (
					select b.id as logid, a.id, a.nombre_aplicacion, b.mensaje_publico, b.fecha_evento, b.fecha_resolucion
						from aplicaciones a, log_aplicaciones b 
					   where a.id = b.aplicacion_id 
						 and b.aplicacion_id = ".$app."
					     and date(b.fecha_evento) between str_to_date('".$fecha_inicial."','%d-%m-%Y') 
					     and str_to_date('".$fecha_final."','%d-%m-%Y')

					   union 

					   select b.id as logid, a.id, a.nombre_aplicacion, b.mensaje_publico, b.fecha_evento, b.fecha_resolucion
						from aplicaciones a, log_aplicaciones b 
					   where a.id = b.aplicacion_id 
						 and b.aplicacion_id = ".$app."
					     and date(b.fecha_resolucion) between str_to_date('".$fecha_inicial."','%d-%m-%Y') 
					     and str_to_date('".$fecha_final."','%d-%m-%Y')
					) z
					      order by z.fecha_evento asc";

		$results = DB::select(DB::raw($sqlSelect) );
		
		/*
		$results = DB::table('log_aplicaciones')
					->join('aplicaciones', 'log_aplicaciones.aplicacion_id', '=', 'aplicaciones.id')
					->whereRaw()
					->get();
		 
$queries = DB::getQueryLog();
$last_query = end($queries);

		print_r($last_query);
		*/
		$ly_datos = array();
		foreach ($results as $log){
			array_push($ly_datos, $log);
		}
		return response()->json([
			"logs" => $results
		]);		
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	
	public function storeLog($idApp, Request $request)
	{
		$log = new \App\Models\LogAplicaciones();

		$log->aplicacion_id = $idApp;
		$log->mensaje_publico = $request->mensaje_publico;
		$log->mensaje_privado = $request->mensaje_privado;
		$log->fecha_evento = $request->fecha_evento;
		$log->fecha_resolucion = $request->fecha_resolucion;
		$log->nivel = $request->nivel;

		$log->save();

		return response()->json([
				"msg" => "Success"
			]
			);

	}

	/**
	* Guardar un mantenimiento, para un rango de fechas, debe buscar las aplicaciones relacionadas con ese servido
	* y registrar un log por aplicacion por dia
	* @return Response
	*/
	public function guardarMantenimiento($ip,Request $request){
		$servidor = $ip;
		$fecha_inicio = $request->fecha_evento;
		$fecha_fin = $request->fecha_resolucion;
		$mensaje_privado = $request->mensaje_privado;
		$mensaje_publico = $request->mensaje_publico;
		$nivel = $request->nivel;

		$sql_select_app = "select configuraciones_aplicaciones.aplicacion_id
							 from configuraciones, configuraciones_aplicaciones 
							where configuraciones.ip = '". $servidor . "'
							  and configuraciones.id = configuraciones_aplicaciones.configuracion_id";

		$results = DB::select(DB::raw($sql_select_app) );
		
		foreach ($results as $idApp){
			
			$log = new \App\Models\LogAplicaciones();
			$log->aplicacion_id = $idApp->aplicacion_id;
			$log->mensaje_publico = $mensaje_publico;
			$log->mensaje_privado = $mensaje_privado;
			$log->fecha_evento = $fecha_inicio;
			$log->fecha_resolucion = $fecha_fin;
			$log->nivel = $nivel;

			$log->save();
		}


	}

	/*
	* Mostrar los los que pertenecen a una aplicacion
	*/
	public function showLogs($idApp)
	{
		$aplicacion = \App\Models\Aplicacion::find($idApp);
		$aplicacion::with('logs')->get();
		$ly_datos = array();

		if ($aplicacion->logs != null){
			$str_retorno = '[';


			$ly_logs = $aplicacion->logs->toArray();

			
			foreach ($ly_logs as $log){
				$obj_log = \App\Models\LogAplicaciones::find($log['Id']);
				array_push($ly_datos, $obj_log);
			}
			return response()->json([
				"logs" => $ly_datos
			]);

		}else{
			return response()->json([
				"msg" => "No se encontraron logs"
			]
			);
		}
		
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
		$log = \App\Models\LogAplicaciones::find($id);
		return response()->json([
				"msg" => "Success",
				"log" => $log
			]
			);
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id, Request $request)
	{
		//
		$log = \App\Models\LogAplicaciones::find($id);

		$log->mensaje_publico = $request->mensaje_publico;
		$log->mensaje_privado = $request->mensaje_privado;
		$log->fecha_evento = $request->fecha_evento;
		$log->fecha_resolucion = $request->fecha_resolucion;
		
		$log->save();
		
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
		$log = \App\Models\LogAplicaciones::find($id);
		$log->delete();
		return response()->json([
				"msg" => "Success"
			],200
			);
	}


}
