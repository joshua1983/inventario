<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Modulo extends Model{

	
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'modulos';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['nombre_modulo','aplicacion_id','formularios','procesos', 'reportes','tablas','estado','tipomodulo'];

	public function ingenieros(){
		return $this->belongsToMany('App\Models\Ingeniero', 'ingenieros_modulos', 'modulos_id','ingenieros_id')
					->withPivot('capacitado', 'estado','principal','id');
	}
	
	public function funcionales(){
		return $this->belongsToMany('App\Models\Funcional', 'funcionales_modulos','modulos_id','funcionales_id')
					->withPivot('capacitado','principal', 'estado','id');
	}
	
	public function aplicacion(){
		return $this->belongsTo('App\Models\Aplicacion');
	}
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = ['updated_at','created_at'];

}