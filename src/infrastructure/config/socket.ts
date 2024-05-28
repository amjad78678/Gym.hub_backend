import { Socket } from "socket.io";
import { Server } from "socket.io";

function socketServer(server: any) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
    },
  });

  interface Users {
    userId: string;
    socketId: string;
  }
  let users: Users[] = [];

  const addUser = (userId: string, socketId: string) => {
    console.log("in add user", userId);
    const userExists = users.find((user) => user.userId === userId);
    if (userExists) {
      userExists.socketId = socketId;
    } else {
      users.push({ userId, socketId });
    }
  };

  const getUser = (userId: string) =>
    users.find((user) => user.userId === userId);

  io.on("connection", (socket: Socket) => {
    console.log("a user connected", socket.id);
    socket.on("add_user", (userId: string) => {
      addUser(userId, socket.id);
      console.log("users", users);
      io.emit("connected");
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
      const user = getUser(typeTo);
      if (user) io.to(user.socketId).emit("typing");
    });

    socket.on("stop_typing", ({ typeTo }) => {
      const user = getUser(typeTo);
      if (user) io.to(user.socketId).emit("stop_typing");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
}

export default socketServer;
