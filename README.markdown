#Video Chat with ConnectionPeer API, WebSockets and Node.js

The source is a demo application based on [Ericsson Labs video chat demo](https://labs.ericsson.com/apis/web-real-time-communication/).
I used [socket.io](https://github.com/LearnBoost/Socket.IO) websockets implementation as well as [hat](https://github.com/substack/node-hat) to generate unique ids
what means that you have to install these modules on your computer for ex.:

`npm install -g socket.io`

or download if from github.
  
I know there are still some bugs, but it is only a demo ;)

Run server with the following command: 

+		for production - `NODE_ENV=production node index.js`</li>
+		for development (more debug info etc) - `NODE_ENV=development node index.js`</li>
+		or simply `node index.js`</li>

Server will be runing at http://localhost:8080/.

No more configuration is required. Please remember about installing modified [WebKit](https://labs.ericsson.com/apis/web-real-time-communication/downloads) library.


