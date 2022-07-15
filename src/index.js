const express = require('express')
const http = require("http")
const path = require("path")
const socketio = require("socket.io")
let Filter = require("bad-words")
const {generateMessage} = require('./utils/message')
const {addUser,RemoveUser,getUser,getUsersInRoom,users} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

server.listen(3000,()=>{
    console.log("Server is up on "+ 3000)
})
let count =0

const publicDirectory = path.join(__dirname,"../public")

app.use(express.static(publicDirectory))


io.on('connection',(socket)=>{
    socket.on('join',({Username,Room},callback)=>{
        const {error,user}=addUser({id: socket.id,Username,Room})
        if(error) return callback(error)

        socket.join(user.Room)
        socket.emit('send',generateMessage({Username:'admin',message : `${user.Username}, welcome to the Room`}))
        socket.broadcast.to(user.Room).emit("join-left",generateMessage({Username: 'admin',message : `${user.Username} has joined!`}))
        io.to(user.Room).emit('RoomData',{
            Room,
            users : getUsersInRoom(user.Room)
        })
    })

    socket.on("message", (message,callback) =>{
        user = getUser(socket.id)
        filter = new Filter()
        filter.addWords("suufi","nin waalan", "address")
        if(filter.isProfane(message)) return callback(generateMessage({Username : user.Username,message:`${message} contains a profine word and it is not allowed`}))
        io.to(user.Room).emit('send',generateMessage({Username : user.Username,message}))
        callback()
    })


    socket.on("sendLocation",({latitude,longitude},callback)=>{
        const user = getUser(socket.id)
        io.to(user.Room).emit('LocationMessage',generateMessage({Username : user.Username,message: `https://www.google.com/maps?q=${latitude},${longitude}`}))
        callback()
    })



    socket.on("disconnect",()=>{
        const user = RemoveUser(socket.id)
        if(user){
            io.to(user.Room).emit("join-left",generateMessage({Username : 'admin',message:`${user.Username} has left the chat`}))
            io.to(user.Room).emit('RoomData',{
                Room : user.Room,
                users : getUsersInRoom(user.Room)
            })
        }
    })

})
