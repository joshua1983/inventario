<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ingeniero extends Model{

	
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'ingenieros';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['nombres', 'apellidos', 'correo', 'telefono','celular','extension','trabajasi', 'trabajati'];

	public function modulos(){
		return $this->belongsToMany('App\Models\Modulo', 'ingenieros_modulos', 'ingenieros_id','modulos_id');
	}
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = ['updated_at','created_at'];

}