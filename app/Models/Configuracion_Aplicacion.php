<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Configuracion_Aplicacion extends Model{

	
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'configuraciones_aplicaciones';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['aplicacion_id','configuracion_id'];

	public function aplicaciones(){
		return $this->belongsToMany('App\Models\Aplicacion', 'configuraciones_aplicaciones', 'configuracion_id','aplicacion_id');
	}
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */

}