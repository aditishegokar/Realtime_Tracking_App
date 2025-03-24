// const express = require('express');
// const app = express();
// const path = require("path");
// //setup of socket io
// const http = require("http");

// const socketio = require("socket.io");

// const server = http.createServer(app);

// const io = socketio(server);

// //ejs

// app.set("view engine", "ejs");
// app.use(express.static(path.join(__dirname, "public")))

// io.on("connection", function(socket){
//     socket.on("send-location", function (data)
// {
//     io.emit("receive-location", { id: socket.id, ...data})
// });
//     console.log("connected");

// });

// app.get("/", function(req, res)  {
//     res.render("index");
// });

// app.listen(3000, (err) => {
//     if (err) console.error('❌ Server failed to start:', err);
//     else console.log('✅ Server is running on http://localhost:3000');
//   });
  

const express = require('express');
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Set EJS view engine
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Socket.io connection setup
io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    // Receive location data from client
    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});

// Serve homepage
app.get("/", (req, res) => {
    res.render("index");
});

// Start server
server.listen(3000, () => {
    console.log('✅ Server running on http://localhost:3000');
});
