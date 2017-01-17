<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permiso extends Model{

	
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'permisos';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['id_ingeniero','modulo','agregar','upd','del','ver', 'admin'];

	public function ingeniero(){
		return $this->belongsTo('App\Models\Ingeniero', 'id_ingeniero', 'id');
	}
	

}
