<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Capacidadesp_Modulo extends Model{

	
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'capacidadesp_Modulos';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['capacidades_id','modulos_id'];

	public function modulos(){
		return $this->belongsToMany('App\Models\Modulo', 'capacidadesesp_modulos', 'capacidades_id','modulos_id');
	}
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = ['updated_at','created_at'];

}