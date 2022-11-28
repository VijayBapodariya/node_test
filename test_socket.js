http = require("http");
https = require("https");
path = require("path");
rq = require("request");
fs = require("graceful-fs");
request = rq;
express = require("express");
socketIO = require("socket.io");

SERVER_PORT = process.argv[2];
SERVICE_HOST = process.argv[3];
SERVER_ID = process.argv[4] ? process.argv[4] : "sw_1";

Server = module.exports = "";
app = express();
router = require("express").Router();
app.set("view engine", "ejs");
console.log("Express module call ", new Date());

app.get("/test", (req, res) => {
	res.send("OK");
});

if (SERVER_ID == "https") {
	var httpsOptions = {
		key: fs.readFileSync("../certificate/server.key"),
		cert: fs.readFileSync("../certificate/final.crt"),
	};
	Server = require("https").createServer(httpsOptions, app);
	console.log("Dev server here");
	// logger.Logger.info("Dev server here .....;");
	// var Server = require("https").createServer(httpsOptions, app);
} else {
	Server = http.createServer(app);
	console.log("Local server here");
	// logger.Logger.info("Local servere here...");
}
console.log("Socket Server ==================> Http");
io = module.exports = socketIO.listen(Server, {
	origins: "*:*",
	pingTimeout: 5000,
	pingInterval: 20000,
	namespace: "/",
	transports: ["websocket", "polling"],
});

io.sockets.on("connection", async function (socket) {
	console.log("New connection " + socket.id);
	// loggerClass.Logger("LOGGER L001", "Socket connected", socket.id);
	// console.log("user connected to socket socket_id=>", socket.id);
	socket.emit("isConnected", {
		connection: `your socket_id ${socket.id}`,
	});

	socket.conn.on("packet", function (packet) {
		if (packet.type === "ping") {
			// c("Ping received......")
		}
	});
});

Server.listen(SERVER_PORT, function () {
	console.log(`Server listening to the port ${SERVER_PORT}`);
});
