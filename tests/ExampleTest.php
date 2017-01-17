<?php
use Illuminate\Foundation\Testing\WithoutMiddleware;

class ExampleTest extends TestCase {
	use WithoutMiddleware;
	/**
	 * Acceso con codigo de respuesta respuesta (Conexion a servidor)
	 *
	 * @return void
	 */
	
	protected $baseUrl = 'http://172.16.200.181/inventario/public/index.html';

	/*
	* Autenticacion Administrador
	*
	*
	*/
	public function testAccesoAdmin(){
		
		$ruta = '/';

		$response = $this->visit($ruta);

		var_dump($response->getContent());

	}

}
