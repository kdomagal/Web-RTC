var server = require("./server");
var router = require("./router");
var routerws = require("./routerws");
var requestHandlers = require("./requestHandlers");

global.Log = require("./logger").Log;	//globalny log
Log.severity = [Log.INFO, Log.ERROR, Log.WARNING];	// ustawienie poziomu logowania

var handle = {}		//tablica obslugiwanych requestow

handle["/upload"] = requestHandlers.start;	// przykladowy request

server.start(router.route, routerws.route, handle);
