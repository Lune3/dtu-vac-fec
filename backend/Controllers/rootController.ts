import { Request, Response, NextFunction } from "express";
import prisma from "../db";

export const rootController = async (req : Request,res : Response) => {
    
    res.json({message:"ok"});
}

export default rootController;