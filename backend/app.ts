import 'dotenv/config'
import express, { Express, Request, Response } from "express";
import rootRouter from './Routes/rootRouter';
import { courseRouter } from './Routes/courseRouter';
import { commentRouter } from './Routes/commentRouter';
import cors from "cors"

const app : Express = express();
app.use(cors<Request>());
app.use(express.urlencoded({ extended: true}));

const PORT = process.env.PORT || 3000

app.use('/',rootRouter);
app.use('/course',courseRouter);
app.use('/comment',commentRouter);

app.listen(PORT,() => {
    console.log("server running");
})