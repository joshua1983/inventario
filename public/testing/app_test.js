describe('Verificacion del entorno', function(){
	beforeEach(module('ngResource', function ($provide, $controllerProvider){
		$provide.value('testVal',4);
		$controllerProvider.register('HomeCtrl',function ($scope){
			$scope.hello = "hola";
		})
	}));

    it('Debe poder injectar dependencias', inject(function ($resource, testVal){
    	expect($resource).toBeDefined();
    	expect(testVal).toBe(4);
    }));

    it('Debe poder compilar expresiones de angular', inject(function ($rootScope,$compile){
    	$rootScope.sum=4;

    	var expression = '<p> 2+2= {{sum}}</p>';
    	var element = $compile(expression)($rootScope);
    	expect(element.html()).not.toContain('2+2= 4');

    	$rootScope.$digest(); // proces la expresion y compila html en el DOM virtual

    	expect(element.html()).toContain('2+2= 4');
    }));

    it('Debe poder injectar controladores', inject(function ($rootScope, $controller){
    	var $Scope = $rootScope.$new(),
    		ctrl = $controller('HomeCtrl',{$scope: $Scope});
    	expect($Scope.hello).toBe('hola');
    }));
}); 

describe('Pruebas del modulo aplicaciones',function (){
	var $httpBackend;
	beforeEach(module('inventarioApp'));
	beforeEach(inject(function (_$httpBackend_){
		$httpBackend = _$httpBackend_;
		
	}))

	afterEach(function (){
		
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it('Debe retornar una lista de todas las aplicaciones', inject(function (InventarioApp){
		$httpBackend.expectGET('http://172.16.200.181/inventario/public/index.php/aplicaciones').respond(200,[
		{
			"msg": "Success" ,
			"apps": []
		}]);

		var apps = InventarioApp.get().success(function (respuesta){
			expect(respuesta.msg).toEqual('Success');
			expect(respuesta.apps.length).toBeGreaterThan(0);
		}).error(function (respuesta){
			expect(false).toEqual(true);
		});

		$httpBackend.flush();

		

	}));
});