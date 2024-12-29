import 'dotenv/config'
import express, { Express, Request, Response } from "express";
import rootRouter from './Routes/rootRouter';
import { courseRouter } from './Routes/courseRouter';
import { commentRouter } from './Routes/commentRouter';
import session from "express-session";
import cors from "cors";
import { authRouter } from './Routes/authRouter';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { userRouter } from './Routes/userRouter';

const app : Express = express();
 
app.use(
    session({
      cookie:{
        maxAge:24*60*60*1000,
      },
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      
    })
);
  
 
app.use(passport.session());

app.use(cors<Request>({
    origin: process.env.APPURL, 
    credentials: true, 
  })); 
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());

const PORT = parseInt(process.env.PORT!) || 3000

app.use('/',rootRouter);
app.use('/course',courseRouter);
app.use('/comment',commentRouter);
app.use('/auth/google',authRouter);
app.use('/user',userRouter);

app.listen(PORT,'0.0.0.0',() => {
    console.log("server running");
})