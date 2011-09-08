var fs = require('fs');
var path = require('path');

// obsluguje requesty do stron, funkcje dla GET i POST
function route(handle, pathname, response, postData, queryData) {
	Log.debug("Routing " + pathname);
	if (typeof handle[pathname] ==='function') {
		if (queryData) {
				return handle[pathname](response, queryData);
		}
		if (postData) {
				return handle[pathname](response, postData);
		}
		return handle[pathname](response, postData, queryData);
	} else {
	
		var filePath = '.' + pathname;
		if (filePath === "./") {
			filePath = "./index.html";
		}

		var extname = path.extname(filePath);
		var contentType = 'text/html';
		switch (extname) {
			case '.js':
				contentType = 'text/javascript';
				break;
			case '.css':
				contentType = 'text/css';
				break;
			case '.png':
				contentType = 'image/x-png';
				break;
		}
	
		path.exists(filePath, function(exists) {
	
			if (exists) {
				Log.debug("Page found: " + filePath);
				fs.readFile(filePath, function(error, content) {
					if (error) {
						Log.error(" 500 Could not read " + filePath);
						response.writeHead(500);
						response.write("Error 500");
						response.end();
					}
					else {
						response.writeHead(200, { 'Content-Type': contentType });
						response.end(content, 'utf-8');
					}
				});
			}
			else {
				Log.warning("Page not found: " + filePath);
				response.writeHead(404, {"Content-Type": "text/plain"});
				response.write("404 Not found");
				response.end();
			}
		});
	}
}

exports.route = route;
