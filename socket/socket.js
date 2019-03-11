const messageController = require("../message/message.controller");

module.exports = function(io) {
  // //server side code for private messaging starts from here
  io.on("connection", socket => {
    console.log(socket.id);

    socket.on("join_PM", params => {
      socket.join(params.room1);
      socket.join(params.room2);
      console.log({ room: params.room1, room2: params.room2 });
    });

    //Listening for private message
    socket.on("private_message", (message, callback) => {
      //The ones connected to this room will be able to see the messages
      console.log(io.sockets.adapter.rooms);
      io.to(message.room).emit("new_message", {
        text: message.message,
        sender: message.sender,
        receiver: message.receiver,
        createdAt: message.createdAt,
        isRead: message.isRead,
        room: message.room,
        room2: message.room2
      });
      //logging the message
      console.log(message);
      messageController.saveMessage(message);
      callback();
    });

    socket.on("new_message", function(data) {
      // The oncoming message should be rendered here
      console.log("Event rriggered");
      console.log(data);
    });

    // socket.on('disconnect', function () {
    // 	socket.removeAllListeners('private_message');
    // 	socket.removeAllListeners('new_message');
    // 	socket.removeAllListeners('disconnect');
    // 	io.removeAllListeners('connection');
    // });
  });
};
