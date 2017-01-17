<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aplicacion extends Model{

	
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'aplicaciones';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['codigo_aplicacion', 'nombre_aplicacion','nombre_visor', 'modulo', 'dba_id','tec_id'];

	public function configuraciones(){
		return $this->hasMany('App\Models\Configuracion', 'aplicacion_id', 'id');
	}
	public function modulos(){
		return $this->hasMany('App\Models\Modulo', 'aplicacion_id', 'id');
	}	
	public function ingenierodba(){
		return $this->hasMany('App\Models\Ingeniero', 'dba_id','dba_id');
	}
	public function ingenierotec(){
		return $this->hasMany('App\Models\Ingeniero', 'tec_id','tec_id');
	}
	public function logs(){
		return $this->hasMany('App\Models\LogAplicaciones', 'aplicacion_id','id');
	}
/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = ['updated_at','created_at'];

}
