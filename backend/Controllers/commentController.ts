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
        res.status(200).json({comments:comments});
    } catch (error) {
        console.log("error getting comments",error);
        res.status(500).json({message:"Server error"});
    }
}   
const validateComment = [
    body("title").trim().isLength({min:3,max:100}).withMessage('Comment should be between 3 to 100 words')
    .escape(),
    body("teacherName").trim().isEmpty().withMessage('Name cannot be empty').isAlpha().withMessage("Must only contains letter"),
    body("grade").trim().isLength({min:1,max:2}).withMessage('Invalid Grade').matches(/(O|P|F|C){1}|(A|B)\+?/g)
]

export const postComment = [validateComment,async (req : Request, res : Response) => {
    try {
        const result = validationResult(req);
        if(result.isEmpty()){
            const data = matchedData(req);
            const comment = await prisma.comment.create({
                data:{
                    title:data.title,
                    commentCourse:req.params.courseName,
                    teacherName:data.teacherName,
                    gradeObtain:data.grade
                }
            })
            res.json({comment:comment});
        }
        else{
            throw new Error("Error in input");
        }
    } catch (error) {
        res.status(302).send(error);
    }
}
];