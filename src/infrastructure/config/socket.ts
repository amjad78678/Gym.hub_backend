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
      console.log("add user cheythu .................." + userId);
      console.log('users',users)
    });

    socket.on("chat_started", ({ to }) => {
      const user = getUser(to);
      console.log("user chat ______ started", user);
      if (user) {
        io.to(user.socketId).emit("chat_started");
      }
    });

    socket.on("send_message",({sender,receiver,content})=>{
       console.log('sendMessage',sender,receiver,content)
       const senderData = getUser(sender)
       const receiverData = getUser(receiver)

  console.log('senderdata',senderData,'receiver',receiverData)
       if(senderData) io.to(senderData.socketId).emit("message",{sender,receiver,content})
       if(receiverData) io.to(receiverData.socketId).emit("message",{sender,receiver,content})
    })



    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  });

  return io;
}

export default socketServer;
