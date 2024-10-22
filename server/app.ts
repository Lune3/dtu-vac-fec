import 'dotenv/config'
import express, { Request, Response } from "express";
import fileIndexRoute from "./routes/fileIndexRoute"

const app = express();

app.use('/',fileIndexRoute);

app.listen(process.env.PORT || 3000,() => {
    console.log('Server Running');
})



