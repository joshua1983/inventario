<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Funcional extends Model{

	
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'funcionales';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['nombres', 'apellidos', 'correo', 'telefono','extension'];

	public function modulos(){
		return $this->belongsToMany('App\Models\Modulo', 'funcionales_modulos', 'funcionales_id','modulos_id')
					->withPivot('capacitado','estado','id');
	}
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = ['updated_at','created_at'];

}