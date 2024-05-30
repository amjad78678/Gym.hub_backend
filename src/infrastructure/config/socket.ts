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
    console.log("Adding/updating user:", userId);
    const userExists = users.find((user) => user.userId === userId);
    if (userExists) {
      userExists.socketId = socketId;
    } else {
      users.push({ userId, socketId });
    }
    console.log("Current users:", users);
  };

  // const removeUser = (socketId: string) => {
  //   users = users.filter((user) => user.socketId !== socketId);
  //   console.log("Removed user with socket ID:", socketId);
  //   console.log("Current users after removal:", users);
  // };

  const getUser = (userId: string) =>
    users.find((user) => user.userId === userId);

  io.on("connection", (socket: Socket) => {
    console.log("A user connected", socket.id);

    socket.on("add_user", (userId: string) => {
      addUser(userId, socket.id);
      io.emit("connected");
    });

    socket.on("send_message", ({ sender, receiver, content }) => {
      console.log("send_message event triggered");
      const receiverData = getUser(receiver);
      console.log("Receiver data:", receiverData);
      if (receiverData) {
        io.to(receiverData.socketId).emit("message", {
          sender,
          receiver,
          content,
        });
      }
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
      console.log("User disconnected", socket.id);
      // removeUser(socket.id);
    });
  });

  return io;
}

export default socketServer;
