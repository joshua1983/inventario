<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Capacidad extends Model{

	
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'capacidades';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['nombre'];
	
	

	public function especificas(){
		return $this->hasMany('App\Models\CapacidadEspecifica','capacidad_id','id');
	}

	/*
	Campo virtual que no existe en la bd
	protected $appends = array('mods');
	public function getModsAttribute(){
		return "-";
	}
	*/
	
	
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = ['updated_at','created_at'];

}