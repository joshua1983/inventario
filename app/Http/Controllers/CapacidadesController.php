<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use DB;


class CapacidadesController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		// Mostrar todas las capacidades
		$capacidades = \App\Models\Capacidad::get();
		$ly_capacidades = $capacidades->toArray();
		$str_retorno = '{';
		$str_retorno = $str_retorno . ' "msg": "Success","caps": [';

		foreach($ly_capacidades as $cap){

			$id = $cap["id"];
			$nombre = $cap["nombre"];
			$ly_caps = $this->capacidadesEspecificas($id);



			$str_retorno = $str_retorno . ' {
				"id": '.$id.',
				"nombre": "'. $nombre .'",
				"capacidades": '.$ly_caps.'
				},';

		}
		if ($str_retorno != '{ "msg": "Success","caps": [')
			$str_retorno = substr($str_retorno, 0, -1);
		$str_retorno = $str_retorno . ']}';

		return response($str_retorno);
	}

	public function capacidadesEspecificas($idCap){
		$capacidad = \App\Models\Capacidad::find($idCap);
		$capacidad::with('especificas')->get();
		if ($capacidad->especificas != null){
			$ly_retorno = $capacidad->especificas->toArray();

			$str_retorno = '[';

			foreach($ly_retorno as $cap){

				$v_cap = \App\Models\CapacidadEspecifica::find($cap['id']);


				$id = $v_cap['id'];
				$id_cap = $v_cap['capacidad_id'];
				$nombre = $v_cap['nombre'];
				$nivel = $v_cap['nivel'];

				$nivelPersonaModulo = $this->getValorPersona($id,0);
				$nivelPersonaAplicacion = $this->getValorPersona($id,1);

				$v_cap::with('modulos','aplicaciones')->get();

				$ly_modulos = $v_cap->modulos->toArray();

				$ly_aplicaciones = $v_cap->aplicaciones->toArray();


				$str_retorno = $str_retorno . '{
					"id": '. $id .',
					"capacidad_id": '. $id_cap .',
					"nombre": "'.$nombre.'",
					"nivel": '.$nivel.',
					"nivelPersonaModulo": '. $nivelPersonaModulo .',
					"nivelPersonaAplicacion": '. $nivelPersonaAplicacion .',
					"modulos": '.json_encode($ly_modulos).',
					"aplicaciones": '.json_encode($ly_aplicaciones).'
					},';
			}

			if ($str_retorno != '[')
				$str_retorno = substr($str_retorno, 0, -1);
			$str_retorno = $str_retorno . ']';


			return $str_retorno;
		}else{
			return 'capacidades no encontradadas';
		}
	}

	public function getValorPersona($idCapacidad, $tipo){
		// 0 es modulo 1 es aplicacion

		if ($tipo == 0){

			$sqlSelect = "select count(1) as cantidad
							from capacidades_modulos a left join ingenieros_modulos b on b.modulos_id = a.modulos_id
							                           left join ingenieros c on b.ingenieros_id = c.id
							                           left join funcionales_modulos d on d.modulos_id = a.modulos_id
							                           left join funcionales e on d.funcionales_id = e.id
							where a.capacidades_id = :idCap
							";

			$results = DB::select( DB::raw($sqlSelect), array(
						'idCap' => $idCapacidad
					) );

			$cantidad = $results[0]->cantidad;

			if($cantidad == 0){
				return 0;
			}else{
				$sqlSelect = "select count(1) as cantidad
	from capacidades_modulos a left join ingenieros_modulos b on b.modulos_id = a.modulos_id
	                           left join ingenieros c on b.ingenieros_id = c.id
	                           left join funcionales_modulos d on d.modulos_id = a.modulos_id
	                           left join funcionales e on d.funcionales_id = e.id
	where d.capacitado = 1 and b.capacitado =1 and a.capacidades_id = :idCap";
				$results = DB::select( DB::raw($sqlSelect), array(
						'idCap' => $idCapacidad
					) );

				$cantidad = $results[0]->cantidad;

				if ($cantidad > 0){

					$sqlSelect = "select count(1) as cantidad
									from capacidades_modulos a  left join ingenieros_modulos b on b.modulos_id = a.modulos_id
									                            left join ingenieros c on b.ingenieros_id = c.id
									where  a.capacidades_id = :idCap";
					$results = DB::select( DB::raw($sqlSelect), array(
						'idCap' => $idCapacidad
					) );
					$cantidadIngenieros = $results[0]->cantidad;
					$sqlSelect = "select count(1) as cantidad
									from capacidades_modulos a left join funcionales_modulos d on d.modulos_id = a.modulos_id
										                       left join funcionales e on d.funcionales_id = e.id
									where  a.capacidades_id = :idCap";
					$results = DB::select( DB::raw($sqlSelect), array(
						'idCap' => $idCapacidad
					) );
					$cantidadFuncionales = $results[0]->cantidad;
					if ($cantidad >= $cantidadIngenieros || $cantidad >= $cantidadFuncionales){
						return 2;
					}else{
						return 1;
					}
				}else{
					return 1;
				}
			}


		}else{


			$sqlSelect = "select count(1) as cantidad
						from capacidades_aplicaciones a left join aplicaciones a1 on a.aplicacion_id = a1.id
                                left join modulos a2 on a2.aplicacion_id = a1.id
                                left join ingenieros_modulos b on b.modulos_id = a2.id
	                            left join ingenieros c on b.ingenieros_id = c.id
                                left join funcionales_modulos d on d.modulos_id = a2.id
	                            left join funcionales e on d.funcionales_id = e.id
							where a.capacidades_id = :idCap
							";

			$results = DB::select( DB::raw($sqlSelect), array(
						'idCap' => $idCapacidad
					) );

			$cantidad = $results[0]->cantidad;

			if($cantidad == 0){
				return 0;
			}else{
				$sqlSelect = "select sum(az.cantidad) as cantidad from (
										select count(1) as cantidad
										  from capacidades_aplicaciones a left join aplicaciones a1 on a.aplicacion_id = a1.id
								            		                    left join modulos a2 on a2.aplicacion_id = a1.id
								                                		left join ingenieros_modulos b on b.modulos_id = a2.id
									                            		left join ingenieros c on b.ingenieros_id = c.id
										 where b.capacitado = 1   and a.capacidades_id = :idCapIng
								union all
										select count(1) as cantidad
										  from capacidades_aplicaciones a left join aplicaciones a1 on a.aplicacion_id = a1.id
								                                		left join modulos a2 on a2.aplicacion_id = a1.id
								                                		left join funcionales_modulos d on d.modulos_id = a2.id
									                            		left join funcionales e on d.funcionales_id = e.id
										 where  d.capacitado =1 and a.capacidades_id = :idCapFun) az  ";
				$results = DB::select( DB::raw($sqlSelect), array(
						'idCapIng' => $idCapacidad,
						'idCapFun' => $idCapacidad
					) );

				$cantidad = $results[0]->cantidad;

				if ($cantidad > 0){
					$sqlSelect = "select count(1) as cantidad
									from capacidades_aplicaciones a left join aplicaciones a1 on a.aplicacion_id = a1.id
									                                left join modulos a2 on a2.aplicacion_id = a1.id
									                                left join ingenieros_modulos b on b.modulos_id = a2.id
										                            left join ingenieros c on b.ingenieros_id = c.id
									where  a.capacidades_id = :idCap";
					$results = DB::select( DB::raw($sqlSelect), array(
						'idCap' => $idCapacidad
					) );
					$cantidadIngenieros = $results[0]->cantidad;
					$sqlSelect = "select count(1) as cantidad
									from capacidades_aplicaciones a left join aplicaciones a1 on a.aplicacion_id = a1.id
									                                left join modulos a2 on a2.aplicacion_id = a1.id
									                                left join funcionales_modulos d on d.modulos_id = a2.id
										                            left join funcionales e on d.funcionales_id = e.id
									where  a.capacidades_id = :idCap";
					$results = DB::select( DB::raw($sqlSelect), array(
						'idCap' => $idCapacidad
					) );
					$cantidadFuncionales = $results[0]->cantidad;
					if ($cantidad >= $cantidadIngenieros + $cantidadFuncionales){
						return 2;
					}else{
						return 1;
					}

				}else{
					return 1;
				}
			}

		}				
	}

	public function modulos($idCap){
		$capacidad = \App\Models\CapacidadEspecifica::find($idCap);
		$ly_retorno = array();
		if($capacidad != null){
			$capacidad::with('modulos')->get();
			if ($capacidad->modulos != null){
				$ly_retorno = $capacidad->modulos->toArray();
				return $ly_retorno;
			}else{
				return 'modulos no encontradados';
			}

		}else{
			return 'capacidad no encontrada';
		}
	}

	public function aplicaciones($idCap){
		$capacidad = \App\Models\CapacidadEspecifica::find($idCap);
		$ly_retorno = array();
		if($capacidad != null){
			$capacidad::with('aplicaciones')->get();
			if ($capacidad->aplicaciones != null){
				$ly_retorno = $capacidad->aplicaciones->toArray();
				return $ly_retorno;
			}else{
				return 'aplicaciones no encontradados';
			}

		}else{
			return 'capacidad no encontrada';
		}
	}

	public function getCaracteristica($idCar){
		$caracteristica = \App\Models\CapacidadEspecifica::find($idCar);
		return response()->json([
				"msg" => "Encontrado",
				"car" => json_encode($caracteristica)
			],200
			);
	}

	public function getCaracteristicaNivel($idCar){
		$sqlSelect = "select nivel, capacidades_id, aplicacion_id from capacidades_aplicaciones where id  = :idCap";
		$results = DB::select( DB::raw($sqlSelect), array(
				'idCap' => $idCar
			) );


		return response()->json([
				"msg" => "Encontrado",
				"nivel" => $results[0]->nivel,
				"capacidad" => $results[0]->capacidades_id,
				"aplicacion" => $results[0]->aplicacion_id
			],200
			);
	}



	public function asignarApp($idApp, Request $request){

		DB::statement(
				DB::raw(
						"insert into capacidades_aplicaciones (capacidades_id, aplicacion_id, nivel) values(?,?,?)"
					), array($request->especifica, $idApp, $request->nivel)
			);

		return '{"msg": 1}';
	}

	public function asignarMod($idMod, Request $request){
		DB::statement(
				DB::raw(
						"insert into capacidades_modulos (capacidades_id, modulos_id, nivel) values(?,?,?)"
					), array($request->especifica, $idMod, $request->nivel)
			);

		return '{"msg": 1}';
	}




	public function updateApp($idApp, Request $request){

		DB::statement(
				DB::raw(
						"update capacidades_aplicaciones set nivel = ? where capacidades_id = ? and aplicacion_id = ?"
					), array($request->nivel,$request->especifica,$idApp)
			);

		return '{"msg": 1}';
	}


	public function delApp($idApp, $idCap){

		DB::statement(
				DB::raw(
						"delete from capacidades_aplicaciones where capacidades_id = ? and aplicacion_id = ?"
					), array($idCap,$idApp)
			);

		return '{"msg": 1}';
	}

	public function storeCap(Request $request){
		$capacidad = new \App\Models\Capacidad();

		$capacidad->nombre = $request->nombre;
		$capacidad->save();

		return '{"msg": 1, "id": '. $capacidad->id .'}';


	}

	public function delCap($id){
		$capacidad = \App\Models\Capacidad::find($id);
		$capacidad->delete();
		return response()->json([
				"msg" => "Success"
			],200
			);
	}

	public function delCapEsp($id){
		$capacidad = \App\Models\CapacidadEspecifica::find($id);
		$capacidad->delete();
		return response()->json([
				"msg" => "Success"
			],200
			);
	}

	public function updateCap($id, Request $request){
		$capacidad = \App\Models\Capacidad::find($id);
		$capacidad->nombre = $request->nombre;
		$capacidad->save();
		return response()->json([
				"msg" => "Actualizado"
			],200
			);
	}

	public function getCapacidad($id){
		$capacidad = \App\Models\Capacidad::find($id);
		return response()->json([
				"msg" => "Success",
				"cap" => $capacidad
			],200
			);
	}

	public function nuevaCaract(Request $request){
		$caracteristica = new \App\Models\CapacidadEspecifica();
		$caracteristica->nombre = $request->nombre;
		$caracteristica->capacidad_id = $request->capacidad_id;
		$caracteristica->nivel = $request->nivel;
		$caracteristica->save();

		return response()->json([
				"msg" => "Creado"
			],200
			);
	}

	public function updCaract($idCar, Request $request){
		$caracteristica = \App\Models\CapacidadEspecifica::find($idCar);
		$caracteristica->nombre = $request->nombre;
		$caracteristica->capacidad_id = $request->capacidad_id;
		$caracteristica->nivel = $request->nivel;
		$caracteristica->save();

		return response()->json([
				"msg" => "Caracteristica actualizada"
			],200
			);
	}




}
