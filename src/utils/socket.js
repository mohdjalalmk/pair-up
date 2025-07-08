const socketIO = require("socket.io");
const { generateRoomId } = require("./generateRoomId");
const Chat = require("../models/chat");
const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      //   origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {

    socket.on("joinChat", ({ toUserId, fromUserId }) => {
      const chatRoomId = generateRoomId(fromUserId, toUserId);
      socket.join(chatRoomId);
    });

    socket.on("sendMessage", async ({ toUserId, fromUserId, message }) => {
      try {
        const chatRoomId = generateRoomId(fromUserId, toUserId);
        let chat = await Chat.findOne({
          participants: { $all: [toUserId, fromUserId] },
        });
        if (!chat) {
          chat = new Chat({
            participants: [toUserId, fromUserId],
            messages: [],
          });
        }
        chat.messages.push({
          fromUserId,
          text: message,
        });
        await chat.save();
        io.to(chatRoomId).emit("receiveMessage", {
          fromUserId,
          message,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {}
    });

    socket.on("disconnect", () => {
    //   console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = { initializeSocket };
