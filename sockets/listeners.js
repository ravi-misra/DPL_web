const socHandle = require("./handlers");

const listenerObject = {
    CARS1: {
        caRS1: true,
        cars1listener(io) {
            io.of("ca-rs1").on("connection", (socket) => {
                if (this.caRS1) {
                    console.log(`CA RS1 connected (id:${socket.id})`);
                    socHandle.socketCarbonAreaRS1(io, socket);
                    this.caRS1 = false;
                    socket.on("disconnect", (reason) => {
                        console.log(`CA RS1 disconnected (id:${socket.id})`);
                        this.caRS1 = true;
                        socHandle.socketCarbonAreaRS1Disconnect(io);
                    });
                } else {
                    socket.emit('reject');
                    socket.disconnect(true);
                    console.log(`CA RS1 client rejected (id:${socket.id})`);
                }
            });
        }
    },
    CARS2: {
        caRS2: true,
        cars2listener(io) {
            io.of("ca-rs2").on("connection", (socket) => {
                if (this.caRS2) {
                    console.log(`CA RS2 connected (id:${socket.id})`)
                    socHandle.socketCarbonAreaRS2(io, socket);
                    this.caRS2 = false;
                    socket.on("disconnect", (reason) => {
                        console.log(`CA RS2 disconnected (id:${socket.id})`)
                        this.caRS2 = true;
                        socHandle.socketCarbonAreaRS2Disconnect(io);
                    });
                } else {
                    socket.emit('reject');
                    socket.disconnect(true);
                    console.log(`CA RS2 client rejected (id:${socket.id})`);
                }
            });
        }
    }
}


module.exports = listenerObject;