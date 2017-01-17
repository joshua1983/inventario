<?php namespace App\Http\Controllers;

      use Illuminate\Http\Request;
      use App\Http\Controllers\Controller;
      use DB;


      class ModulosCapController extends Controller {

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
			      $ly_modulo = $this->modulos($id);
			      
			      $str_retorno = $str_retorno . ' {
				"id": '.$id.',
				"nombre": "'. $nombre .'",
				"mods": '.json_encode($ly_modulo).'
				},';
			      
		      }
		      if ($str_retorno != '{ "msg": "Success","caps": [')
		      	$str_retorno = substr($str_retorno, 0, -1);
		      $str_retorno = $str_retorno . ']}';
		      
		      return response($str_retorno);
	      }
	      
	      public function modulos($idCap){
		      $capacidad = \App\Models\Capacidad::find($idCap);
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

	      public function getModuloCap($idCap){
		      $sqlSelect = "select nivel, capacidades_id, modulos_id from capacidades_modulos where id  = :idCap";
		      $results = DB::select( DB::raw($sqlSelect), array(
				  'idCap' => $idCap
			  ) );

		      
		      return response()->json([
				  "msg" => "Encontrado",
				  "nivel" => $results[0]->nivel,
				  "capacidad" => $results[0]->capacidades_id,
				  "modulos" => $results[0]->modulos_id
			  ],200
			  ); 
	      }

	      public function updateModCap($idCapMod, Request $request){
		      DB::statement(
				  DB::raw(
					  "update capacidades_modulos set nivel = ? where id = ?"
				  ), array($request->nivel,$idCapMod)	
			  );
		      
		      return '{"msg": 1}';
	      }

	      public function asignarMod($idMod, Request $request){
		      
		      DB::statement(
				  DB::raw(
					  "insert into capacidades_modulos (capacidades_id, modulos_id, nivel) values(?,?,?)"
				  ), array($request->caracteriza, $idMod, $request->nivel)
			  );
		      
		      return '{"msg": 1}';
	      }

	      
	      public function updateMod($idMod, Request $request){
		      
		      DB::statement(
				  DB::raw(
					  "update capacidades_modulos set nivel = ? where modulos_id = ? and capacidades_id = ?"
				  ), array($request->nivel,$idMod,$request->capacidad)	
			  );
		      
		      return '{"msg": 1}';
	      }

	      public function delMod($idMod, $idCap){
		      
		      DB::statement(
				  DB::raw(
					  "delete from capacidades_modulos where capacidades_id = ? and modulos_id = ?"
				  ), array($idCap,$idMod)
			  );
		      
		      return '{"msg": 1}';
	      }


	      public function updateIngCapacitado($idRel, Request $request){
		      DB::statement(
				  DB::raw(
					  "update ingenieros_modulos set capacitado=?, principal=?, estado = ? where id = ?"
				  ), array($request->capacitado, $request->principal, $request->estado, $idRel)
			  );
		      
		      return '{"msg": 1, "rel": "'.$idRel.'-'.$request->estado.'"}';
	      }

	      public function updateFuncCapacitado($idRel, Request $request){
		      DB::statement(
				  DB::raw(
					  "update funcionales_modulos set capacitado=?, principal=?, estado=? where id = ?"
				  ), array($request->capacitado, $request->principal, $request->estado, $idRel)
			  );
		      
		      return '{"msg": 1}';
	      }


      }
