var Http = require("http"),
    Url = require("url"),
    ws = require("socket.io");

function start(route, routews, handle) {

	function onRequest(request, response) {
			var pathname = Url.parse(request.url).pathname;
			var queryData = Url.parse(request.url).query;
			var postData = "";
			
			Log.debug("Request for " + request.url + " received.");
			 
			request.setEncoding("utf8");

		  request.addListener("data", function(postDataChunk) {
		    postData += postDataChunk;
		    Log.debug("Received POST data chunk '"+ postDataChunk + "'.");
		  });

		  request.addListener("end", function() {
		    route(handle, pathname, response, postData, queryData);
		  });
	}
	
	var server = Http.createServer(onRequest);
	server.listen(8080);
	Log.info("Server has started on port 8080.");
	
	wsServer = ws.listen(server);
	Log.info("Websockets Server listen on port 8080.");

	wsServer.sockets.on('connection', function (socket) {
		routews(socket, handle);
	});	

	// konfiguracja ws servera
	wsServer.configure('production', function(){
		wsServer.enable('browser client minification');
		wsServer.enable('browser client etag');
		wsServer.set('log level', 1);

		wsServer.set('transports', [
		  'websocket'
		, 'flashsocket'
		, 'htmlfile'
		, 'xhr-polling'
		, 'jsonp-polling'
		]);
	});
}

exports.start = start;

