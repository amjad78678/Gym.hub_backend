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
    online: boolean;
  }
  let users: Users[] = [];

  const addUser = (userId: string, socketId: string) => {
    const userExists = users.find((user) => user.userId === userId);
    if (userExists) {
      userExists.socketId = socketId;
      userExists.online = true
    } else {
      users.push({ userId, socketId,online:true });
    }
    io.emit('onlined_users',users.filter((user)=>user.online))
  };

  const removeUser = (socketId: string) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const getUser = (userId: string) =>
    users.find((user) => user.userId === userId);

  io.on("connection", (socket: Socket) => {
    socket.on("add_user", (userId: string) => {
      addUser(userId, socket.id);
      io.emit("connected");
    });

 
    socket.on("send_message", ({ sender, receiver, content,createdAt }) => {
      const receiverData = getUser(receiver);
      const senderData = getUser(sender);
      if (senderData?.socketId === receiverData?.socketId) {
        console.log("user socket and trainer socket have been same so far");
      }
      if (receiverData) {
        io.to(receiverData.socketId).emit("message", {
          sender,
          receiver,
          content,
          createdAt
        });
      }
    });

    socket.on("typing", ({ typeTo }) => {
      const user = getUser(typeTo);
      if (user) io.to(user.socketId).emit("typedUser");
    });

    socket.on("stop_typing", ({ typeTo }) => {
      const user = getUser(typeTo);
      if (user) io.to(user.socketId).emit("stopTypedUser");
    });

    socket.on("call:start", ({ sender, receiver }) => {
      const receiverData = getUser(receiver);
      if (receiverData) {
        io.to(receiverData.socketId).emit("call:start", sender);
      }
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
    });
  });

  return io;
}

export default socketServer;
