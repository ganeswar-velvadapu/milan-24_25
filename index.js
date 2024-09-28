import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import main from "./utils/db.js"
import authRoutes from './routes/user.js'
import sortRoutes from './routes/sort.js'
import chatRoutes from './routes/message.js'
import profileRoutes from './routes/profile.js'
import http from 'http'
import {Server} from 'socket.io'
import socketHandler from "./controllers/chat.js"
import checkToken from "./middlewares/checkToken.js"
import { homeCoversations } from "./controllers/home.js"


dotenv.config()
const app = express()
const server = http.createServer(app)
const io = new Server(server)

//middlewares

app.set("view-engine","ejs")
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended:true}))



//routes
app.use('/api/auth', authRoutes); 
app.use('/api/sort',sortRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/profile",profileRoutes)
app.get("/",checkToken,homeCoversations)

socketHandler(io)

server.listen(process.env.PORT,()=>{
    main()
    console.log(`Server listening on port ${process.env.PORT}`)
})

