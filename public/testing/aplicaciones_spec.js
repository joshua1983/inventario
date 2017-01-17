/*

Sistemas de pruebas Protractor. 
Para ejecutar ubicarse en el D.O.S. sobre la carpeta public/testing y ejecutar 
"protractor protractor.conf.js"

- la 'x' antes de describe y de it anula el test para su ejecucion
- se recomienda usar cygwin como terminal para ver la traza completa de los errores
- Debe tener instalado node.js

*/

/*
--------------------------- Pruebas sobre el login -------------------
*/

xdescribe("Prueba de login en la pagina principal - ",function(){
	var IP_SERVIDOR ="http://172.16.200.181/";
		
	it("1.Debe realizar login correcto",function(){
		browser.get(IP_SERVIDOR + "inventario/public/index.html#/loginPop");
		element(by.model("usuario")).sendKeys("admin");
		element(by.model("password")).sendKeys("123");
		element(by.buttonText("Entrar")).click();
		
	});
	
	it("2.Debe realizar login fallido",function(){
		browser.get(IP_SERVIDOR + "inventario/public/index.html#/loginPop");
		element(by.model("usuario")).sendKeys("admin");
		element(by.model("password")).sendKeys("123456");
		element(by.buttonText("Entrar")).click();
		
		expect(element(by.binding("resultado")).getText()).toEqual("Contraseña invalida");
	});
	
	it("3.Debe realizar login correcto con AD",function(){
		browser.get(IP_SERVIDOR + "inventario/public/index.html#/loginPop");
		element(by.model("usuario")).sendKeys("jbarrios");
		element(by.model("password")).sendKeys("catalina2015");
		element(by.buttonText("Entrar")).click();
		
	});
});

/*
------------------- Pruebas sobre el modulo de aplicaciones -------------------
*/

xdescribe("Pruebas de modulo de aplicaciones - ", function(){
	var IP_SERVIDOR ="http://172.16.200.181/";
	it("Debe mostrar el listado de aplicaciones > 0", function(){
		browser.get(IP_SERVIDOR + "inventario/public/index.html#/homeApp");
		// La columna se tiene que poder visualizar en la pagina
		var apps = 	element.all(by.repeater("app in InventarioApp").column("app.codigo_aplicacion")).map(function(elemento){
			return elemento.getText();
		});
		apps.then(function (lista){
			expect(lista.length).toBeGreaterThan(1);
		});		
	});
});

/*
------------------- Pruebas sobre el modulo de ingenieros -------------------
*/

xdescribe("Pruebas de modulo de ingenieros - ", function(){
	var IP_SERVIDOR = "http://172.16.200.181/";
	it("Debe mostrar el listado de ingenieros > 0", function(){
		browser.get(IP_SERVIDOR + "inventario/public/index.html#/homeIng");
		var ings = 	element.all(by.repeater("ing in Ingenieros").column("ing.nombres")).map(function(elemento){
			return elemento.getText();
		});
		ings.then(function (lista){
			expect(lista.length).toBeGreaterThan(1);
		});		
	});
});

/*
------------------- Pruebas sobre el modulo de funcionales -------------------
*/

xdescribe("Pruebas de modulo de funcionales - ", function(){
	var IP_SERVIDOR = "http://172.16.200.181/";
	it("Debe mostrar el listado de funcionales > 0", function(){
		browser.get(IP_SERVIDOR + "inventario/public/index.html#/homeFunc");
		var func = 	element.all(by.repeater("fun in Funcionales").column("fun.nombres")).map(function(elemento){
			return elemento.getText();
		});
		func.then(function (lista){
			expect(lista.length).toBeGreaterThan(1);
		});	
	});
});

/*
------------------- Pruebas sobre el modulo de informes -------------------

 - Falta cuadrar la espera que cargue el filtro de la consulta
*/
xdescribe("Pruebas sobre los informes - ",function(){
	var IP_SERVIDOR = "http://172.16.200.181/";
	
	beforeEach(function() {
        browser.get(IP_SERVIDOR + "inventario/public/index.html#/homeInf");
		browser.waitForAngular();
		browser.wait(element(by.id("div_tabla_ing")).isPresent);
    });
	
	it("Debe filtrar por nombre 'josue'",function(){
		var func = 	element.all(by.repeater("ing in dataIngModulos | filter:{nombres: filtroNombres, nombre_aplicacion: filtroApp, nombre_modulo: filtroMod}").column("ing.nombres")).map(function(elemento){
			return elemento.getText();
		});
		func.then(function (lista){
			var cajaTexto = element(by.id("txtNombresFiltro"));
			
			cajaTexto.sendKeys("Josue").then(function(){
				expect(lista.length).toBeGreaterThan(0);
				expect(lista.length).toEqual(23);
			});
		});		
	});
});

/*
--------------------------- Pruebas sobre la configuracion de los servidores -------------------
*/

describe("Pruebas sobre los servidores - ", function(){
	var IP_SERVIDOR = "http://172.16.200.181/"; // Servidor local o dominio web

	beforeEach(function(){
		browser.get(IP_SERVIDOR + "inventario/public/index.html#/loginPop");
		element(by.model("usuario")).sendKeys("jbarrios");
		element(by.model("password")).sendKeys("catalina2015");
		element(by.buttonText("Entrar")).click();
		browser.waitForAngular();
	});

	it("Debe mostrar el listado de servidores > 0",function(){
		browser.get(IP_SERVIDOR + "inventario/public/index.html#/homeConf");
		var func = 	element.all(by.repeater("conf in Configuraciones").column("conf.servidor")).map(function(elemento){
			return elemento.getText();
		});
		func.then(function (lista){
			expect(lista.length).toBeGreaterThan(0);
		});
	});

	it("Debe crear un servidor - ", function(){
		browser.get(IP_SERVIDOR + "inventario/public/index.html#/createConf");
		browser.waitForAngular();
		element(by.id("txtServidor")).sendKeys("ServidorPruebaTest");
		element(by.id("txtIP")).sendKeys("127.0.0.1");
		element(by.id("txtUsuario")).sendKeys("Linux - Ubuntu");
		//selectDropdownByNumber($("#txtTipo"), 1, 300);
		element(by.id("txtNotas")).sendKeys("Notas de prueba");
		element(by.buttonText("Crear")).click();
	});

	it("Debe Actualizar el servidor de prueba - ",function(){
		browser.get(IP_SERVIDOR + "inventario/public/index.html#/homeConf");
		browser.waitForAngular();
		element.all(by.repeater("conf in Configuraciones")).filter(function (row){
			return row.element(by.id("nombreServ")).getText().then(function (name){
				return name === "ServidorPruebaTest - 127.0.0.1";
			});
		}).first().element(by.css(".pencil")).click();

		browser.waitForAngular();
		element(by.id("txtNotas")).sendKeys("Notas de prueba - Edicion");
		element(by.buttonText("Guardar")).click();
	});


	it("Debe Eliminar un servidor - ", function(){
		browser.get(IP_SERVIDOR + "inventario/public/index.html#/homeConf");
		browser.waitForAngular();
		element.all(by.repeater("conf in Configuraciones")).filter(function (row){
			return row.element(by.id("nombreServ")).getText().then(function (name){
				return name === "ServidorPruebaTest - 127.0.0.1";
			});
		}).first().element(by.css(".trash")).click();

		var alerta = browser.switchTo().alert();
		alerta.accept();

		var nombreServidores = $$('.list-group-item').getText();
		expect(nombreServidores).not.toContain("ServidorPruebaTest - 127.0.0.1");
	});	
});

// -------------------------------------------------------------------------------------------------------------------------------