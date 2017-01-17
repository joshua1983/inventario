describe('HomeCtrl', function(){

	var fabrica;

	//mock Application to allow us to inject our own dependencies
    beforeEach(module('inventarioApp'));
    //mock the controller for the same reason and include $rootScope and $controller
    beforeEach(inject(function(_$httpBackend_){
    	$httpBackend = _$httpBackend_;
    	var response = [];
        $httpBackend.expectGET('http://127.0.0.1/inventario/index.php/aplicaciones').respond(response.push(apps));
    
    }));

    
    it('Deberia traer una lista de aplicaciones: ', function(){
    	var datos = fabrica.get();
    	expect(fabrica).toBeDefined();
    	expect(datos).toBeDefined();
    	console.log(datos);
    	expect(datos.apps).toBeDefined();
    	//expect(datos.apps.length).toBeGreaterThan(0);
    });
});