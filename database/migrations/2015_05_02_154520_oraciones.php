<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Oraciones extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		// creacion de tablas
		Schema::create('Aplicaciones', function($table){
			$table->increments("id");
			$table->integer("dba_id");
			$table->integer("tec_id");
			$table->string("codigo_aplicacion");
			$table->string("nombre_aplicacion");
			$table->string("estado");
			$table->timestamps();
		});
		
		Schema::create('Modulos', function($table){
			$table->increments("id");
			$table->integer("aplicacion_id")->unsigned();
			$table->string("nombre_modulo");
			$table->integer("formularios");
			$table->integer("procesos");
			$table->integer("reportes");
			$table->integer("tablas");
			$table->string("estado");
			$table->string("tipomodulo");
			$table->timestamps();
		});
		
		Schema::create('Configuraciones', function($table){
			$table->increments("id");
			$table->integer("aplicacion_id")->unsigned();
			$table->string("servidor");
			$table->string("ip");
			$table->string("usuario");
			$table->string("password");
			$table->string("nota");
			$table->timestamps();
		});
		
		Schema::create('Ingenieros_modulos', function($table){
			$table->increments("id");
			$table->integer("ingenieros_id")->unsigned();
			$table->integer("modulos_id")->unsigned();
			$table->timestamps();
		});
		
		Schema::create('Funcionales_modulos', function($table){
			$table->increments("id");
			$table->integer("funcionales_id")->unsigned();
			$table->integer("modulos_id")->unsigned();
			$table->timestamps();
		});
		
		
		Schema::create('Ingenieros', function($table){
			$table->increments("id");
			$table->string("nombres");
			$table->string("apellidos");
			$table->string("correo");
			$table->string("telefono");
			$table->string("celular");
			$table->string("extension");
			$table->boolean("trabajasi");
			$table->boolean("trabajati");
			$table->boolean("dba");
			$table->boolean("tecserv");
			$table->timestamps();
		});
		
		Schema::create('Funcionales', function($table){
			$table->increments("id");
			$table->string("nombres");
			$table->string("apellidos");
			$table->string("correo");
			$table->string("telefono");
			$table->string("extension");
			$table->timestamps();
		});
		
		Schema::create('Capacidades', function($table){
			$table->increments("id");
			$table->string("nombre");
			$table->timestamps();
		});
				
		Schema::create('CapacidadesEspecificas', function($table){
			$table->increments("id");
			$table->string("nombre");
			$table->timestamps();
		});
		
		Schema::create('CapacidadesEsp_modulos', function($table){
			$table->increments("id");
			$table->integer("capacidades_id")->unsigned();
			$table->integer("capacidadesesp_id")->unsigned();
			$table->integer("modulos_id")->unsigned();
			$table->timestamps();
		});
		
		Schema::create('Usuarios', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('username');
			$table->string('email');
			$table->string('password');
			$table->string('authentication_token')->nullable();
			$table->timestamps();
		});
		
		// Migracion llaves foraneas
		
		Schema::table('ingenieros_modulos', function(Blueprint $table)
		{
			$table->foreign('ingenieros_id')->references('id')->on('Ingenieros')->onDelete('cascade');;
			$table->foreign('modulos_id')->references('id')->on('Modulos')->onDelete('cascade');;
		});
		
		Schema::table('funcionales_modulos', function(Blueprint $table)
		{
			$table->foreign('funcionales_id')->references('id')->on('Funcionales')->onDelete('cascade');;
			$table->foreign('modulos_id')->references('id')->on('Modulos')->onDelete('cascade');;
		});
		
		Schema::table('Configuraciones', function(Blueprint $table)
		{
			$table->foreign('aplicacion_id')->references('id')->on('Aplicaciones')->onDelete('cascade');;
		});
		
		Schema::table('Modulos', function(Blueprint $table)
		{
			$table->foreign('aplicacion_id')->references('id')->on('Aplicaciones')->onDelete('cascade');;
		});

	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('oraciones', function(Blueprint $table)
		{
			//
		});
	}

}
