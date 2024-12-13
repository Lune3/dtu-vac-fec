import { Request,Response} from "express";
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
    callbackURL: `${process.env.SERVERURL}/auth/google/callback`,
    passReqToCallback:true
  },
  async function(req:Request,accessToken, refreshToken, profile : Profile, done) {
    if(!profile.emails)throw new Error("No email found");
    try{
        let newUser = await prisma.user.findUnique({
            where:{
                email:profile.emails[0].value
            }
        })
        if(!newUser){
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
        console.log(error);
        done(error,false);
    }
  }
));


passport.serializeUser((user,done) => {
    done(null,user.Id);
})

passport.deserializeUser(async (newUserId : string,done) => {
    try{
        const user = await prisma.user.findUnique({
            where:{
                Id:newUserId
            }
        })
        done(null,user);
    }
    catch(error){
        done(error,null);
    }
})

export default passport;
