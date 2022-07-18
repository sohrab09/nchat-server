const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require('dotenv').config()


app.use(cors());
app.use(express.json());


const PORT = 5000;
const MONGO_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d1aei.mongodb.net/?retryWrites=true&w=majority`
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connection Successfully....");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get('/', (req, res) => {
  res.send(`
        <h1>N Chat</h1>
        <h2>Nassa Group Internal Chat Application....</h2>
  `);
})

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT || PORT, () =>
  console.log(`Server Running On Port ${PORT}`)
);
// const io = socket(server, {
//   cors: {
//     origin: "https://nassachatapp.netlify.app/",
//     credentials: false,
//     methods: ["GET", "POST"],
//   },
// });

const io = require("socket.io")(server,{
  cors: {
    origin: "https://nassachatapp.netlify.app/",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders:["secretHeader"],
    credentials: true
  }
  })

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
