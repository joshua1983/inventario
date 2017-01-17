<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CapacidadEspecifica extends Model{

	
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
	protected $fillable = ['nombre','capacidad_id'];
	
	public function capacidad(){
		return $this->belongsTo('Capacidad');
	}
	
	public function aplicaciones(){
		return $this->belongsToMany('App\Models\Aplicacion', 'capacidades_aplicaciones', 'capacidades_id','aplicacion_id')
					->withPivot('nivel','id');
	}

	public function modulos(){
		return $this->belongsToMany('App\Models\Modulo', 'capacidades_modulos', 'capacidades_id','modulos_id')
					->withPivot('nivel','id');
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