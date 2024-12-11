import { Request, Response, NextFunction } from "express";
import passportGoogle from "passport-google-oauth20";
import passport from "passport";
import prisma from "../db";
import { Profile } from "passport-google-oauth20";

declare global {
    namespace Express {
      interface User {
        Id: string;
        email: string;
        isMod: boolean;
        isAdmin: boolean;
      }
    }
  }

const GoogleStrategy = passportGoogle.Strategy;


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID!,
    clientSecret: process.env.GOOGLE_SECRET!,
    callbackURL: `${process.env.APPURL}/`,
    passReqToCallback:true
  },
  async function(req:Request,accessToken, refreshToken, profile : Profile, done) {
    try{
        let newUser = await prisma.user.findUnique({
            where:{
                Id:profile.id
            }
        })
        if(!newUser){
            if(!profile.emails)throw new Error("No email found");
            newUser = await prisma.user.create({
                data:{
                    email:profile.emails[0].value,
                    isMod:false,
                    isAdmin:false
                }
            })
        }
        done(null,newUser);
    }
    catch(error){
        done(error,false);
    }
  }
));


passport.serializeUser((user,done) => {
    done(null,user.Id);
})

passport.deserializeUser(async (newUser : Express.User,done) => {
    try{
        const user = await prisma.user.findUnique({
            where:{
                Id:newUser.Id
            }
        })
        done(null,user);
    }
    catch(error){
        done(error,null);
    }
})

export default passport;
