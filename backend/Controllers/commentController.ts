import { Request, Response, NextFunction } from "express";
import { body, matchedData, validationResult } from 'express-validator';
import prisma from "../db";

export const getComment = async (req : Request,res : Response) => {
    try {
        const comments = await prisma.comment.findMany({
            where:{
                course:{
                    name:req.params.courseName
                }
            }
        })
        res.status(200).json({comments});
    } catch (error) {
        console.log("error getting comments",error);
        res.status(500).json({message:"Server error"});
    }
}   

export const validateComment = [
    body("title").trim().isLength({min:3,max:100}).withMessage('Comment should be between 3 to 100 words')
    .escape(),
    body("teacherName").trim().not().isEmpty().withMessage('Name cannot be empty').isAlpha().withMessage("Must only contains letter"),
]

export const postComment = async (req : Request, res : Response) => {
    try {
        const course = await prisma.course.findFirst({
            where:{
                name:{
                    contains:req.params.courseName
                }
            }
        })
        if(!course){
            res.status(400).json({error:"can't find the course"})
        }
        else{
            const result = validationResult(req);
            if(!result.isEmpty()){
                res.status(400).json({message:"validation error"})
            }
            else{
                let userId : string = req.cookies['userId'];
                const user = await prisma.user.findUnique({
                    where:{
                        Id:userId
                    }
                })
                const newComment = await prisma.comment.create({
                    data:{
                        title:req.body.title,
                        commentCourse:course.Id,
                        teacherName:req.body.teacherName,
                        gradeObtain:req.body.grade,
                        commentUser:user?.userId!
                    }
                }); 
                
                res.status(200).json({newComment})
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Prisma error:", error); 
            res.status(445).json({
                error: error.message,
                details: error.stack
            });
        } else {
            res.status(445).json({
                error: "An unknown error occurred",
                details: String(error)
            });
        }
    }
};

export const checkAuth = async(req : Request,res : Response,next: NextFunction) =>{
    const userCookie = req.cookies['connect.sid'];
    if(!userCookie){
        res.status(401).send("");
    }
    else{
        next();
    }
}