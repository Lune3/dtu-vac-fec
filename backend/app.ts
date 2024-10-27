import 'dotenv/config'
import express, { Express, Request, Response } from "express";
import rootRouter from './Routes/rootRouter';
import { courseRouter } from './Routes/courseRouter';

const app : Express = express();

const PORT = process.env.PORT || 3000

app.use('/',rootRouter);
app.use('/course',courseRouter);

app.listen(PORT,() => {
    console.log("server running");
})