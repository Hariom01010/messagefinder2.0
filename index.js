import express from "express"
import dotenv from "dotenv"
import commands from "./routes/commands.route.js"
dotenv.config()

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json({
    verify: (req,res, buf, encoding)=> {
        req.rawBody = buf.toString(encoding || 'utf-8')
    }
}))

app.use('/interactions', commands)

app.listen(PORT, ()=>{
    console.log(`Server listening on ${PORT}`)
})