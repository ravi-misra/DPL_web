//RS1 handlers
module.exports.socketCarbonAreaRS1 = (io, socket) => {
    const rs1_silo_level = (payload) => {
        io.emit("ca-rs1-update", payload);
    }
    socket.on("rs1_silo_level", rs1_silo_level);
}


module.exports.socketCarbonAreaRS1Disconnect = (io) => {
    io.emit("ca-rs1-update", {cb: "xxxxxx", alumina: "xxxxxx"});
}

//RS2 handlers
module.exports.socketCarbonAreaRS2 = (io, socket) => {
    const rs2_silo_level = (payload) => {
        io.emit("ca-rs2-update", payload);
    }
    socket.on("rs2_silo_level", rs2_silo_level);
}


module.exports.socketCarbonAreaRS2Disconnect = (io) => {
    io.emit("ca-rs2-update", {cb: "xxxxxx", alumina: "xxxxxx"});
}
