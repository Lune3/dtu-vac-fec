import { Router } from "express";
import passport from "../Controllers/authController";


export const authRouter = Router();

authRouter.get('/',passport.authenticate('google',{scope:['email']}));

authRouter.get('/callback',passport.authenticate('google',{failureRedirect:'/error404'}),(req,res) =>{
    res.redirect(`${process.env.APPURL}`);
})




