const socHandle = require("./handlers");

const listenerObject = {
    CARS1: {
        caRS1: true,
        cars1listener(io) {
            io.of("ca-rs1").on("connection", (socket) => {
                setTimeout(() => {
                    const socketCount = io.of("ca-rs1").sockets.size;
                    if (socketCount == 1 && this.caRS1) {
                        this.caRS1 = false;
                        console.log(
                            `CA RS1 connected (id:${
                                socket.id
                            }) at ${new Date()}`
                        );
                        socHandle.socketCarbonAreaRS1(io, socket);
                        socket.on("disconnect", (reason) => {
                            this.caRS1 = true;
                            console.log(
                                `CA RS1 disconnected (id:${
                                    socket.id
                                }) at ${new Date()}`
                            );
                            socHandle.socketCarbonAreaRS1Disconnect(io);
                        });
                    } else if (socketCount > 1) {
                        socket.emit("reject");
                        socket.disconnect(true);
                        console.log(
                            `CA RS1 client rejected (id:${
                                socket.id
                            }) at ${new Date()}`
                        );
                    }
                }, 20000);
            });
        },
    },
    CARS2: {
        caRS2: true,
        cars2listener(io) {
            io.of("ca-rs2").on("connection", (socket) => {
                setTimeout(() => {
                    const socketCount = io.of("ca-rs2").sockets.size;
                    if (socketCount == 1 && this.caRS2) {
                        this.caRS2 = false;
                        console.log(
                            `CA RS2 connected (id:${
                                socket.id
                            }) at ${new Date()}`
                        );
                        socHandle.socketCarbonAreaRS2(io, socket);
                        socket.on("disconnect", (reason) => {
                            this.caRS2 = true;
                            console.log(
                                `CA RS2 disconnected (id:${
                                    socket.id
                                }) at ${new Date()}`
                            );
                            socHandle.socketCarbonAreaRS2Disconnect(io);
                        });
                    } else if (socketCount > 1) {
                        socket.emit("reject");
                        socket.disconnect(true);
                        console.log(
                            `CA RS2 client rejected (id:${
                                socket.id
                            }) at ${new Date()}`
                        );
                    }
                }, 20000);
            });
        },
    },
};

module.exports = listenerObject;
