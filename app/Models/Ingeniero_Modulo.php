<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ingeniero_Modulo extends Model{

	
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'ingenieros_modulos';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['ingenieros_id','modulos_id', 'capacitado', 'principal', 'estado'];

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