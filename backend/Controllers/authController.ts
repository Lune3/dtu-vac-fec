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

async function generateUniqueUsername() {
    let username;
    let isUnique = false;

    while (!isUnique) {
        const timestamp = Date.now().toString().slice(-5);
        const randomDigits = Math.floor(1000 + Math.random() * 9000).toString(); 
        username = `user${timestamp}${randomDigits}`;

        const existingUser = await prisma.user.findUnique({
            where:{
                userId:username
            }
        });

        if (!existingUser) {
            isUnique = true;
        }
    }

    return username;
}


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
            let idGenerated = await generateUniqueUsername();
            if(typeof(idGenerated) === 'undefined'){
                return done("Internal Error",false);
            }
            else{
                newUser = await prisma.user.create({
                    data:{
                        email:profile.emails[0].value,
                        isMod:false,  
                        isAdmin:false,
                        isBanned:false,
                        userId:idGenerated
                    }
                })
                console.log("NewUser profile = ",newUser);
                done(null,newUser); 
            }
        }
    }
    catch(error){
        console.log(error);
        done(error,false);
    }
  }
));


passport.serializeUser((user,done) => {
    console.log("user id from auth", user);
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
