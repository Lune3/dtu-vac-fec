import { Request, Response, NextFunction } from "express";
import { resolve } from "path";
import { PdfReader } from "pdfreader"; 
import prisma from "../db";

const pdfReader = new PdfReader();

function parsePdf(){
    return new Promise((resolve,reject) => {
        const pdfContent :string [] = [];
        pdfReader.parseFileItems("../public/file0806.pdf", (err, item) => {
            if (err) {
                reject(err);
            } else if (!item) {
                resolve(pdfContent.join("")); 
            } else if (item.text) {
                pdfContent.push(item.text); 
            }
        });
    });
}

const addCoursesToDb = async (courseArray:Array<string>) => {
    for(const course of courseArray){
        const addedCourse = await prisma.course.create({ 
            data:{
                name:course
            }
        })
        console.log(addedCourse);
    }
}

export const readFecFile = async (req: Request, res: Response, next: NextFunction) => {
    let coursesCount : number = -1;
    try {
        coursesCount = await prisma.course.count();
    } catch (error) {
        console.log(error);
    }
    if(coursesCount === 0){
        let pdf = await parsePdf();
        if(typeof(pdf) === "string"){
            const coursePattern = /FEC\d{1,2}[\s\S]*?(?=FEC|S[1-4]|\sO\s)/g;
            const courses = pdf.match(coursePattern);
            if (courses) {
                const courseArray = courses.map((course) => course.trim());
                addCoursesToDb(courseArray);
                res.send(`${pdf} Working`);
            }
            else{
                res.status(500).send("file read error");
            }
        }
        else{
            res.status(500).send("File Read Error");
        }
    }
    else{
        next();
    }
};
