<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Capacidades_Especificas extends Model{

	
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'capacidadesespecificas';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['nombre'];
	
	public function modulos(){
		return $this->belongsToMany('App\Models\Modulo', 'capacidadesesp_modulos', 'capacidades_id','capacidadesesp_id');
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