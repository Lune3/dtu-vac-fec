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

const app : Express = express();
 
app.use(
    session({
      cookie:{
        maxAge:7*24*60*60*1000,
      },
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      
    })
);
 
 
app.use(passport.session());

app.use(cors<Request>({
  origin:[`${process.env.APPURL}`,`${process.env.APPURL2}`],
  credentials:true
})); 
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000

app.use('/',rootRouter);
app.use('/course',courseRouter);
app.use('/comment',commentRouter);
app.use('/auth/google',authRouter);

app.listen(PORT,() => {
    console.log("server running");
})