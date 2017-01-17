<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Funcional_Modulo extends Model{

	
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'funcionales_modulos';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['funcionales_id','modulos_id','capacitado', 'principal', 'estado'];

	public function modulos(){
		return $this->belongsToMany('App\Models\Modulo', 'funcionales_modulos', 'funcionales_id','modulos_id');
	}
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = ['updated_at','created_at'];

}