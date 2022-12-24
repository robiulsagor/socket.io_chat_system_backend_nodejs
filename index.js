const express = require("express")
const app = express()
const http = require("http")
const path = require("path")
const { Server } = require("socket.io")
const messageFormat = require("./utils/messageFormat")
const { join_room, usersByRoom, removeUser } = require("./utils/user")

const server = http.createServer(app)
app.use(express.static(path.join(__dirname, "../public")))
const bot = "Chatbot"

const io = new Server(server)

io.on("connection", socket => {
    socket.on("join_room", ({ username, room }) => {

        const user = join_room(socket.id, username, room)
        socket.join(room)

        // welcome user
        socket.emit("message", messageFormat(bot, "Welcome...", "success"))

        // tell others that someone has connected now
        socket.broadcast.to(room).emit("message", messageFormat(bot, `${username} has been connected!`, "success"))

        // receive message text from frontend and send to everyone on this room
        socket.on("chat_msg", msg => {
            io.to(room).emit("message", messageFormat(username, msg))
        })

        // find users by room and send it to frontend
        socket.emit("users", usersByRoom(room))
        socket.broadcast.emit("users", usersByRoom(room))

        socket.on("disconnect", () => {
            const leftUsers = removeUser(username)
            io.emit("users", leftUsers)

            io.to(room).emit("message", messageFormat(bot, `${username} has left the chat!`, "danger"))
        })
    })
})

server.listen(3000, () => {
    console.log("server started!");
})