const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const { connect, disconnect, users } = require("./utils/Users");

// Allow access control
app.use(cors());

// Set security
app.use(helmet());

// Set route requests help
app.use(morgan("combined"));

// Configure real-time messages

// Configure json requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure static files
app.use(express.static(path.join(__dirname, "../public")));

// Configure routes
app.use("/user", require("./routes/users.route"));
app.use("/maintenace", require("./routes/maintenaces.route"));
app.use("/environment", require("./routes/environments.route"));
app.use("/machine", require("./routes/machines.route"));
app.use("/sparePart", require("./routes/spareParts.route"));
app.use("/rol", require("./routes/rol.route"));

// Configure server
const server = http.createServer(app);

// Configure Socket server
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000",
        method: ["GET", "POST", "PUT", "DELETE"],
    },
});

io.on("connection", (socket) => {
    socket.on("userConnect", (data) => {
        connect(data);
    });

    socket.on("userDisconect", (data) => {
        disconnect(data);
    });
});

module.exports = server;
