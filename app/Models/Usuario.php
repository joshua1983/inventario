<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model{

	
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'usuarios';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['username','email','password','authentication_token'];

	
	protected $hidden = ['updated_at','created_at'];

}