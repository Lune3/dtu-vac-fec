import { Request, Response, NextFunction } from "express";
import prisma from "../db";

export const rootController = async (req : Request,res : Response) => {
    const courses = await prisma.course.findUnique({
        where:{
            name:'CH428 Energy Conservation and Recycling'
        }
    });
    console.log(courses);
    res.send("ok");
}

export default rootController;