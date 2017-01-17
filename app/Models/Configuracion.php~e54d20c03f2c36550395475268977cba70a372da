<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Configuracion extends Model{

	
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'Configuraciones';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	public function aplicaciones(){
		return $this->belongsTo('App\Models\Aplicacion');
	}
	 
	protected $fillable = ['aplicacion_id','servidor', 'ip', 'usuario','password','nota'];

	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = ['updated_at','created_at'];

}