import { Request, Response, NextFunction } from "express";
import passportGoogle from "passport-google-oauth20";
import passport from "passport";
import prisma from "../db";
import { Profile } from "passport-google-oauth20";

const GoogleStrategy = passportGoogle.Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID!,
    clientSecret: process.env.GOOGLE_SECRET!,
    callbackURL: `${process.env.APPURL}/`,
    passReqToCallback:true
  },
  async function(req:Request,accessToken, refreshToken, profile : Profile, cb) {
    try{
        let user = await prisma.user.findUnique({
            where:{
                Id:profile.id
            }
        })
        if(!user){
            if(!profile.emails)throw new Error("No email found");
            user = await prisma.user.create({
                data:{
                    email:profile.emails?.[0]?.value,
                    isMod:false,
                    isAdmin:false
                }
            })
        }
    }
    catch(error){
        console.log(error);
    }
  }
));

