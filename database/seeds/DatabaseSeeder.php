<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Eloquent::unguard();
		\App\Models\Usuario::create([
			'username' => 'admin',
			'email' => 'jbarrios@unab.edu.co',
			'password' => Hash::make('123456')
		]);
	}

}
