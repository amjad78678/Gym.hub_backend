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
    console.log("connected to socket.io" + socket.id);
    socket.on("add_user", (userId: string) => {
      addUser(userId, socket.id);
    });

    socket.on("chat_started", ({ to }) => {
      const user = getUser(to);

      if (user) {
        io.to(user.socketId).emit("chat_started");
      }
    });
  });

  return io;
}

export default socketServer;
