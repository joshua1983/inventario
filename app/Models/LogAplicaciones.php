<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogAplicaciones extends Model{

	
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'log_aplicaciones';
	protected $primaryKey = 'Id';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['aplicacion_id','mensaje_publico','mensaje_privado','fecha_evento','fecha_resolucion'];

	public function aplicacion(){
		return $this->belongsTo('App\Models\Aplicacion', 'aplicacion_id');
	}


	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = ['updated_at','created_at'];


}