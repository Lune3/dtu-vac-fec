import { Request, Response, NextFunction } from "express";
import prisma from "../db";

export const getUser = async (req:Request,res:Response) => {
    try {
        if(!req.cookies['userId']){
            res.status(401).json({message:"Not authorize"});
        }
        else{
            const user = await prisma.user.findUnique({
                where:{
                    Id:req.cookies['userId']
                }
            })
            if(user){
                res.status(200).json({user});
            }
            else{
                res.status(401).json({message:"User not found"});
            }
        }
    } catch (error) {
        res.status(500).json({message:"internal error"});
    }
}