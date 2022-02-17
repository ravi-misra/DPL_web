const { io } = require("socket.io-client");

const socket = io("http://127.0.0.1:3000/carbon-area");
let x = 1, y =1;
socket.on("connect", () => {
    setInterval(emit, 2000);
    function emit() {
        x+=1;
        y+=1;
        socket.emit("rs1_silo_level", {cb: x, alumina:y});
        console.log("sent");
    }
})