const express = require('express');
const socket = require('socket.io');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static("public")); //Once user hits the port, express will use this folder and display index.html inside this folder

const server = app.listen(PORT,()=>{
    console.log('Server started on PORT ',PORT);
})

let io = socket(server); // Calling socket by passing the server we created.
//Whenever you get a connect, run this callback
io.on("connection",(socket)=>{
    console.log("Made socket connection");
    //Receive data from frontend
    socket.on("beginPath", data => {
        //Pass this data to all clients listening on all sockets
        io.sockets.emit("beginPath",data);
    });

    socket.on('drawPath', data => {
        //Pass this data to all clients listening on all sockets
        io.sockets.emit("drawPath",data);
    })
})