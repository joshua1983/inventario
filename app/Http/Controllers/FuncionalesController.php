<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;



class FuncionalesController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		// Mostrar todas las aplicacion
		$ingenieros = \App\Models\Funcional::get();

		return response()->json([
				"msg" => "Success",
				"funcs" => $ingenieros->toArray()
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
		$funcional = new \App\Models\Funcional();

		$funcional->nombres = $request->nombres;
		$funcional->apellidos = $request->apellidos;
		$funcional->correo = $request->correo;
		$funcional->telefono = $request->telefono;
		$funcional->extension = $request->extension;
		
		$funcional->save();

		return response()->json([
				"msg" => "Success",
				"id" => $funcional->id
			]
			);

	}
	
	public function storeMod($id, $idApp)
	{
		$fun_mod = new \App\Models\Funcional_Modulo();

		$fun_mod->funcionales_id = $id;
		$fun_mod->modulos_id = $idApp;
		$fun_mod->save();

		return response()->json([
				"msg" => "Success",
				"id" => $fun_mod->id
			]
			);

	}
	
	public function removeMod($id, $idApp)
	{
		$ing_mod = \App\Models\Funcional_Modulo::whereRaw('funcionales_id = ? and modulos_id = ?',[$id,$idApp]);
		
		$ing_mod->delete();

		return response()->json([
				"msg" => "Success"
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
		$funcional = \App\Models\Funcional::find($id);
		return response()->json([
				"msg" => "Success",
				"funcional" => $funcional
			]
			);
	}
	
	public function showMod($id,$idApp)
	{
		//
		$modulo = \App\Models\Modulo::find($idApp);
		if ($modulo != null){
			$modulo::with('funcionales')->get();
			
			return response()->json([
				"msg" => "Success",
				"funcionales" => $modulo->funcionales->toArray()
			]
			);
		}else{
			return response()->json([
				"msg" => "No hay datos",
				"funcionales" => ""
			]
			);
		}
		
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
		$funcional = \App\Models\Funcional::find($id);

		$funcional->nombres = $request->nombres;
		$funcional->apellidos = $request->apellidos;
		$funcional->correo = $request->correo;
		$funcional->telefono = $request->telefono;
		$funcional->extension = $request->extension;

		$funcional->save();
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
		$funcional = \App\Models\Funcional::find($id);
		$funcional->delete();
		return response()->json([
				"msg" => "Success"
			],200
			);
	}

}
