<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use DB;

class LoginController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function login(Request $request)
	{
		$login = $request->login;
		$password = $request->password;
		if ($login == "admin" && $password == "123"){
				$permisos = $this->getPermisos(1);
				$str_retorno = '{"user":{
				"id": 1,
				"tipo" : 1,
				"nombre": "Administrador",
				"permisos": '.$permisos.'
				}}';
			return $str_retorno;

		}elseif($login != "admin"){
			$ds = ldap_connect("ldap://amaltea.unab.edu.co:389");

			if ($ds){
			$r = ldap_bind($ds,"uid=".$login.",ou=People,o=unab.edu.co,o=unab.edu.co",$password);

			if ($r){
					// Login ok
				$permisos = $this->getPermisos($this->getCodigoLogin($login));

				$sr = ldap_search($ds, "o=unab.edu.co", "uid=".$login);
				$info = ldap_get_entries($ds, $sr);

				$str_retorno = '{"user":{
				"id": 1,
				"tipo" : 0,
				"nombre": "' .$info[0]["cn"][0] .'",
				"permisos": '.$permisos.'
				}}';
				ldap_close($ds);
				return response($str_retorno);
			}else{
				$bug = "";
				if (ldap_get_option($ds,0x0032,$error)){
					$bug = $error;
				}
				$str_retorno = '{"error":"Usuario o contraseña invalido['.$bug.']"}';
				ldap_close($ds);
				return response($str_retorno);
			}

			}
		}else{
			return response('{"msg": -1}');
		}
		
	}

	public function logout(){

	}

	public function getCodigoLogin($login){
		$lista = explode("@",$login);
		$sqlSelect = "select id from ingenieros where correo = '".$lista[0]."'";
		$ly_datos = array();
		$registros = \DB::select($sqlSelect); 
		$id  = $registros[0]->id;
		return $id;
	}

	public function getPermisos($ingeniero){

		$sqlSelect = "select id_ingeniero, modulo, agregar, upd, del, ver, admin from permisos where id_ingeniero = :id_ing";
      $results = DB::select( DB::raw($sqlSelect), array(
				  'id_ing' => $ingeniero 
			  ) );

		return json_encode($results);
	}

	public function setPermisos($ingeniero, Request $request){
		$agregar = ($request->agregar) ? 1: 0;
		$actualizar = ($request->actualizar) ? 1: 0;
		$borrar = ($request->borrar) ? 1: 0;
		$ver = ($request->ver) ? 1: 0;
		$administrador = ($request->administrador) ? 1: 0;

		$selectCount = "select count(1)  cantidad from permisos where id_ingeniero = :id_ing and modulo = :modulo";
		$resultado = DB::select(DB::raw($selectCount),array(
				'id_ing' => $ingeniero,
				'modulo' => $request->modulo
			));
		$cantidad = $resultado[0]->cantidad;
		try{
			if ($cantidad > 0){
				$sqlUpdate = "update permisos set agregar = ?, upd = ?, del = ?, ver = ?, admin = ? where id_ingeniero = ? and modulo = ?";
				DB::update($sqlUpdate,array(
						$agregar,
						$actualizar,
						$borrar,
						$ver,
						$administrador,
						$ingeniero,
						$request->modulo
					));
				echo '{"msg": 1}';
			}
			else{
				$sqlInsert = "insert into permisos (agregar, upd, del, ver, admin, id_ingeniero, modulo) values (?, ?, ?, ?, ?, ?, ?)";
				DB::insert($sqlInsert,array(
						$agregar,
						$actualizar,
						$borrar,
						$ver,
						$administrador,
						$ingeniero,
						$request->modulo
					));
				echo '{"msg": 1}';
			}
		}catch(PDOException $e){
			echo '{"msg": '.$e.'}';
		}
		

	}

 
}
