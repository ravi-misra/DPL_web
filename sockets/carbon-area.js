module.exports.socketCarbonAreaRS1 = (io, socket) => {
    const rs1_silo_level = (payload) => {
        io.emit("update", payload);
    }
    socket.on("rs1_silo_level", rs1_silo_level);
}


module.exports.socketCarbonAreaRS1Disconnect = (io) => {
    io.emit("update", {cb: "xxxxxx", alumina: "xxxxxx"});
}
