

var Signaling = {

    sUrl : "http://localhost:8080", 
    fifoId : null,   // id do otrzymywania signaling msg
    remoteFifoId : null, // fifo for sending signaling messages
    Peer : null,     // obiekt PeerConnection
    eventSrc : null,
    
    socket : null,	// websockets connector

    TURN_CONFIG : "TURN 193.234.219.124:3478",

    FIFO_STATE_NONE        : 0,   // FIFO nieutworzone
    FIFO_STATE_CREATED     : 1,   // stworzenie zaproszenia
    FIFO_STATE_ACCEPTED    : 2,   // zaakceptowanie zaproszenia
    fifo_state : 0,

    // ===== Initial handshake

    // utworzenie sesji 
    create : function(on_url_created) {
    	console.log("Signaling.create"); 
    	
    	Signaling.socket = io.connect('http://localhost:8080/');
			
			// event na polaczenie
    	Signaling.socket.on('connected', function (data) {
    		console.log(data.msg);
    		// pobranie unikalnego id
		  	Signaling.socket.emit('getid', {});  
			});
			
			// event po otrzymaniu id
			Signaling.socket.on('getid', function(data){
				console.log("Received id: " + data.id);
				Signaling.fifoId = data.id;
				Signaling.fifo_state = Signaling.FIFO_STATE_CREATED;
				on_url_created(Signaling.sUrl + "/accept.html?id=" + Signaling.fifoId, Signaling.fifoId);
			});
			
			// event po otrzymaniu sigMsg
    	Signaling.socket.on('recvSigMsg', function(data){
    		Signaling.onSigMsg(data);
    	})
    },
       
    // akceptacja zaproszenia: zapisanie id zdalnego klienta, przekazanie swojego id
    accept : function(remoteFifoId) {  
    	console.log("Signaling.accept remote fifo id: " + remoteFifoId);
			Signaling.remoteFifoId = remoteFifoId;
			Signaling.sendSigMsg("" + Signaling.fifoId);
	
			console.log("Signaling.accept creating new peer connection");
			Signaling.Peer = new webkitPeerConnection(Signaling.TURN_CONFIG, Signaling.sendSigMsg);
			Signaling.Peer.onconnecting = Signaling.onconnectingInternal;
			Signaling.Peer.onopen = Signaling.onopenInternal;
	
			console.log("Signaling.accpet Signaling.FIFO_STATE_ACCEPTED");
			Signaling.fifo_state = Signaling.FIFO_STATE_ACCEPTED;
    },

    // ===== Sending messages

    // wyslanie sigMsg 
    sendSigMsg : function(msg) {
    	console.log("Signaling.sendSigMsg: " + msg);  
    	Signaling.socket.emit('sendSigMsg', {id: Signaling.remoteFifoId, msg: msg});
    },

    // ===== Receiving messages

    // odebranie sigMsg
    onSigMsg : function (data) {
			var msg = data.msgBody;
			console.log("Signaling.onSigMsg msg: " + msg);
	
			switch (Signaling.fifo_state) {
					// status utworzenia - to znaczy ze otrzymano zdalny id
					case Signaling.FIFO_STATE_CREATED:
							console.log("Signaling.onSigMsg FIFO_STATE_CREATED");
							Signaling.remoteFifoId = msg;
							Signaling.fifo_state = Signaling.FIFO_STATE_ACCEPTED;
							console.log("Signaling.onSigMsg createing new peer connection");
							Signaling.Peer = new webkitPeerConnection(Signaling.TURN_CONFIG, Signaling.sendSigMsg);
							console.log("Signaling.onSigMsg state: " + Signaling.Peer.readyState);
							Signaling.Peer.onconnecting = Signaling.onconnectingInternal;
							Signaling.Peer.onopen = Signaling.onopenInternal;
							Signaling.fifo_state = Signaling.FIFO_STATE_ACCEPTED;
							break;

					case Signaling.FIFO_STATE_ACCEPTED:
							console.log("Signaling.onSigMsg FIFO_STATE_ACCEPTED");
							console.log("Signaling.onSigMsg processSignalingMessage");
							Signaling.Peer.processSignalingMessage(msg);
							console.log("Signaling.onSigMsg state: " + Signaling.Peer.readyState);
							break;

					case Signaling.FIFO_STATE_NONE:
					default:
							console.log("Error: got message in state #" + Signaling.fifo_state);
							break;
			}
    },

    onconnectingInternal : function() {
			if (Signaling.onconnecting) {
					Signaling.onconnecting();
			}
    },

    onopenInternal : function() {
			if (Signaling.onopen) {
					Signaling.onopen();
			}
    },

};




