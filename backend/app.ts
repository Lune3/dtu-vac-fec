import 'dotenv/config'
import express, { Express, Request, Response } from "express";

const app : Express = express();

const PORT = process.env.PORT || 3000

app.get("/",async (req : Request , res : Response) => {
    res.send("hello");
})

app.listen(PORT,() => {
    console.log("server running");
})