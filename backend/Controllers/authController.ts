import { Request,Response,NextFunction} from "express";
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
            }
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

export const googleCallback = async (req : Request,res:Response) => {
    if(req.user){
        const {Id:userId} = req.user;
        res.cookie("userId",userId,{
            httpOnly:true,
            sameSite:'lax',
            maxAge:24*60*60*1000
        });
        res.redirect(`${process.env.APPURL}`);
    }
    else{
        res.status(401).send("Authentication failed");
    }
}

export const logout = async (req : Request,res : Response,next : NextFunction) => {
    req.session.destroy(function (err) {
        if(err){
            res.status(400).json({err:'Logout Error'});
        }
        else{
            res.clearCookie('connect.sid',{path: '/'});
            res.clearCookie('userId',{path:'/'});
            res.redirect(process.env.APPURL!); 
        }
    });
}
export default passport;
