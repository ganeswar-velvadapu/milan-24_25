import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import main from "./utils/db.js"
import authRoutes from './routes/user.js'
import sortRoutes from './routes/sort.js'
dotenv.config()
const app = express()

//middlewares

app.set("view-engine","ejs")
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended:true}))
const corsOptions = {
    origin:"http://localhost:5173",
    credentials : true
}
app.use(cors(corsOptions))



//routes
app.use('/api/auth', authRoutes); 
app.use('/api/sort',sortRoutes)


app.listen(process.env.PORT,()=>{
    main()
    console.log(`Server listening on port ${process.env.PORT}`)
})