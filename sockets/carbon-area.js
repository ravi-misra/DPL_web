module.exports = (io, socket) => {
    const rs1_silo_level = (payload) => {
        console.log("sent", payload);
        io.emit("update", payload);
    }
    socket.on("rs1_silo_level", rs1_silo_level);
}