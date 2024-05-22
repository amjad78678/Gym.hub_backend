import { Socket } from "socket.io";
import { Server } from "socket.io";

function socketServer(server: any) {
  const io = new Server(server, {
    pingTimeout: 120000,
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  interface Users {
    userId: string;
    socketId: string;
  }
  let users: Users[] = [];

  const addUser = (userId: string, socketId: string) => {
    const userExists = users.find((user) => user.userId === userId);

    if (userExists) {
      userExists.socketId = socketId;
    } else {
      users.push({ userId, socketId });
    }
  };
  const getUser = (userId: string) =>
  users.find((user) => user.userId === userId);
  const removeUser = (userId: string) =>
    (users = users.filter((user) => user.userId !== userId));

  io.on("connection", (socket: Socket) => {


    socket.on("add_user", (userId: string) => {
      addUser(userId, socket.id);
      console.log("users", users);
      socket.emit("connected");
    });

    socket.on("chat_started", ({ to }) => {
      const user = getUser(to);
      if (user) {
        io.to(user.socketId).emit("chat_started", { to: user.userId });
      }
    });

    socket.on("send_message", ({ sender, receiver, content }) => {
      const senderData = getUser(sender);
      const receiverData = getUser(receiver);

      if (senderData)
        io.to(senderData.socketId).emit("message", {
          sender,
          receiver,
          content,
        });
      if (receiverData)
        io.to(receiverData.socketId).emit("message", {
          sender,
          receiver,
          content,
        });
    });

    socket.on("typing", ({ typeTo }) => {
      console.log("type kaanikkandea llu", typeTo);
      const user = getUser(typeTo);
      console.log("type kaanikkandea llu", user);
      if (user) io.to(user.socketId).emit("typing");
    });

    socket.on("stop_typing", ({ typeTo }) => {
      const user = getUser(typeTo);
      if (user) io.to(user.socketId).emit("stop_typing");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

  });

  return io;
}

export default socketServer;
