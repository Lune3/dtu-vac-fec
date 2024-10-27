import { Request, Response, NextFunction } from "express";
import prisma from "../db";

export const getCourse = async (req : Request, res: Response) => {
    try {
        const course = await prisma.course.findFirstOrThrow({
            where:{
                name:{
                    contains:req.params.courseName
                }
            }
        })
        res.json({course:course});
    } catch (error) {
        res.status(404).json({message:"Not a valid Course"});
    }
}