import 'dotenv/config'
import express, { Express, Request, Response } from "express";
import fileIndex from './Routes/fileIndex';

const app : Express = express();

const PORT = process.env.PORT || 3000

app.use('/',fileIndex);

app.listen(PORT,() => {
    console.log("server running");
})