import { Router } from "express";
import passport from "../Controllers/authController"
import {Response} from "express";

export const authRouter = Router();

authRouter.get("/", (req, res, next) => {
    console.log("Navigating to /auth/google");
    res.send("hello");
});


// authRouter.get('/',passport.authenticate('google',{scope:['email']}));

// authRouter.get('/callback',passport.authenticate('google',{failureRedirect:'/'},(res : Response) => {
//     res.redirect('/');
// }))

