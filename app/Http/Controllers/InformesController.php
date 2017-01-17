<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;



class InformesController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		

		return response()->json([
				"msg" => "Success",
				"apps" => "Seleccione una opcion"
			]
			);
	}


	/**
	 * Mostrar el informe solicitado
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function getInforme( $id)
	{
		switch($id){
			case 0:
				// informe modulos por ingeniero
				$ly_ingenieros = array();
				$ly_data = array();
				$ingenieros = \DB::table('ingenieros')->get();
				foreach ($ingenieros as $ing){
					array_push($ly_ingenieros,$ing->nombres);
					$count = \DB::select('select count(1) as cantidad from ingenieros_modulos where ingenieros_id = ?',array($ing->id));
					array_push($ly_data, $count[0]->cantidad);
				}
				$json_ings = json_encode($ly_ingenieros);
				$json_data = json_encode($ly_data);
				return  response( '{
					"labels": '. $json_ings .',
					"datos": '. $json_data .'
				}', 200);
			break;
			
			case 1:
				// informe por estado de aplicacion
				$ly_cant = array();
				$ly_estados = array();
				
				$estados = \DB::select('select count(1) as cantidad, estado from aplicaciones group by estado');
				foreach($estados as $app){
					
					switch ($app->estado){
						case 1:
							array_push($ly_estados, "En Produccion");
						break;
						case 2:
							array_push($ly_estados, "En Implementacion");
						break;
						case 3:
							array_push($ly_estados, "En Retiro");
						break;
						case 4:
							array_push($ly_estados, "Retirado");
						break;
					}
					
					array_push($ly_cant, $app->cantidad);
				}
				
				$json_cant = json_encode($ly_cant);
				$json_estado = json_encode($ly_estados);
				
				return  response( '{
					"labelsApp": '. $json_estado .',
					"datosApp": '. $json_cant .'
				}', 200);
				
			break;
			
			case 2:
				$ly_datos = array();
				$registros = \DB::select('select a.nombres, a.apellidos, d.nombre_aplicacion, c.nombre_modulo, b.estado from ingenieros a 
					inner join ingenieros_modulos b on a.id = b.ingenieros_id 
					inner join modulos c on c.id = b.modulos_id 
					inner join aplicaciones d on d.id = c.aplicacion_id 
					order by a.nombres asc');
			
				foreach ($registros as $fila){
					array_push($ly_datos, $fila);
				}
				return response()->json([
					"registros" => $ly_datos
				]);
			
			break;
		}
	}



}
