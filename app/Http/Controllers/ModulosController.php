<?php namespace App\Http\Controllers;

	  use Illuminate\Http\Request;
	  use App\Http\Controllers\Controller;
	  use \Cache;


	  class ModulosController extends Controller {

		  /**
		   * Display a listing of the resource.
		   *
		   * @return Response
		   */
		  public function index()
		  {
			  // Mostrar todas los modulos
			  $modulos = \App\Models\Modulo::get();
			  return response()->json([
				  "msg" => "Modulos",
				  "mods" => $modulos->toArray()
			  ]
			  );
		  }
		  
		  public function indexApp($id)
		  {
			  // Mostrar todas los modulos


		  	if (Cache::has("ModsByApp".$id)){
		  		
		  		$str_retorno = Cache::get("ModsByApp".$id);
		  		return response($str_retorno);

		  	}else{

		  	  $aplicacion = \App\Models\Aplicacion::find($id);
			  if ($aplicacion != null){
				  $str_retorno = '{';
				  $str_retorno = $str_retorno . ' "msg": "Success","modulos": [';
				  
				  $aplicacion::with('modulos')->get();
				  $ly_modulos = $aplicacion->modulos->toArray();
				  foreach($ly_modulos as $mod){
				  	$modulo = \App\Models\Modulo::find($mod["id"]);
				  	$modulo::with("ingenieros")->get();
				  	$modulo::with("funcionales")->get();

				  	$ly_ings = $modulo->ingenieros->toArray();
				  	$ly_func = $modulo->funcionales->toArray();

				  	$aplicacion_id = $mod["aplicacion_id"];
				  	$estado = $mod["estado"];
				  	$formularios = $mod["formularios"];
				  	$id_mod = $mod["id"];
				  	$nombre_modulo = $mod["nombre_modulo"];
				  	$procesos = $mod["procesos"];
				  	$reportes = $mod["reportes"];
				  	$tablas = $mod["tablas"];
				  	$tipomodulo = $mod["tipomodulo"];

				  
					$str_retorno = $str_retorno . ' {
						"aplicacion_id": "'.$aplicacion_id.'",
						"estado": "'.$estado.'",
						"formularios": "'.$formularios.'",
						"id": "'.$id_mod.'",
						"nombre_modulo": "'.$nombre_modulo.'",
						"procesos": "'.$procesos.'",
						"reportes": "'.$reportes.'",
						"tablas": "'.$tablas.'",
						"tipomodulo": "'.$tipomodulo.'",
						"ingenieros": '.json_encode($ly_ings).',
						"funcionales": '.json_encode($ly_func).'
					},';
					  
				  }
				  if ($str_retorno != '{ "msg": "Success","modulos": [')
				  	$str_retorno = substr($str_retorno, 0, -1);
				  $str_retorno = $str_retorno . ']}';

				  Cache::put("ModsByApp".$id, $str_retorno,20);

				  return response($str_retorno);
				  
			  }else{
				  return response()->json([
					  "msg" => "App No Encontrada",
					  "mods" => ""
				  ]
				  );
			  }

		  	}

			  
			  
			  
		  }
		  
		  /**
		   * Store a newly created resource in storage.
		   *
		   * @return Response
		   */
		  public function store(Request $request)
		  {
		  	Cache::forget('ModsByApp'.$request->aplicacion_id);

			  $mod = new \App\Models\Modulo();

			  $mod->nombre_modulo = $request->nombre_modulo;
			  $mod->formularios = $request->formularios;
			  $mod->procesos = $request->procesos;
			  $mod->reportes = $request->reportes;
			  $mod->tablas = $request->tablas;
			  $mod->estado= $request->estado;
			  $mod->tipomodulo= $request->tipomodulo;
			  $mod->aplicacion_id = $request->aplicacion_id;
			  
			  $mod->save();

			  return response()->json([
				  "msg" => "Success",
				  "id" => $mod->id
			  ]
			  );

		  }

		  /**
		   * Display the specified resource.
		   *
		   * @param  int  $id
		   * @return Response
		   */
		  public function show($id,$idApp)
		  {
			  //
			  $mod = \App\Models\Modulo::find($idApp);
			  return response()->json([
				  "msg" => "Success",
				  "modulo" => $mod
			  ]
			  );
		  }


		  /**
		   * Update the specified resource in storage.
		   *
		   * @param  int  $id
		   * @return Response
		   */
		  public function update(Request $request)
		  {
			  //
		  	

			  $mod = \App\Models\Modulo::find($request->id);

			  Cache::forget('ModsByApp'.$mod->aplicacion_id);

			  $mod->nombre_modulo = $request->nombre_modulo;
			  $mod->formularios = $request->formularios;
			  $mod->procesos = $request->procesos;
			  $mod->reportes = $request->reportes;
			  $mod->tablas = $request->tablas;
			  $mod->estado= $request->estado;
			  $mod->tipomodulo= $request->tipomodulo;
			  
			  $mod->save();

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
		  	Cache::forget('ModsByApp');

			  $mod = \App\Models\Modulo::find($id);
			  Cache::forget('ModsByApp'.$mod->aplicacion_id);
			  $mod->delete();
			  return response()->json([
				  "msg" => "Success"
			  ],200
			  );
		  }

	  }
