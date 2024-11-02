import { Request, Response, NextFunction } from "express";
import prisma from "../db";

export const getCourse = async (req : Request, res: Response) => {
    try {
        try {
        const course = await prisma.course.findFirstOrThrow({
            where:{
                name:{
                    contains:req.params.courseName
                }
            }
        })
        res.status(200).json({course:course});
        } catch (error) {
            res.status(422).json({message:"Invalid course name"});
        }
    } catch (error) {
        console.log("Get course Error",error);
        res.status(500).json({message:"Internal Error"});
    }
}