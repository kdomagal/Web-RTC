var hat = require("hat"); // unique ids

var count = 0;
var sockets = []	// array with connected users

function route(socket, handle) {

	socket.emit('connected', { msg: 'Welcome from server' });
	
	socket.on("getid", function() {
		var uuid = hat();
		sockets[uuid] = { id: uuid, socket: socket};
		socket.emit('getid', { id: uuid });
		Log.info("Socket with id: " + uuid + " saved.");
	});
	
	socket.on("sendSigMsg", function(data) {
		Log.info("Signaling message received.");
		Log.debug("Signaling message received: " + data.msg);
		
		Log.info("Sending to Socket " + data.id)
		if (sockets[data.id]){
			sockets[data.id].socket.emit("recvSigMsg", { msgBody: data.msg });
		}
	});
	
	socket.on('disconnect', function(){
		Log.info("User disconnected.");		
  });
	
	
}

exports.route = route;
