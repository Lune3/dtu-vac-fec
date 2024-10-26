import { Request, Response, NextFunction } from "express";
import { PdfReader } from "pdfreader";
import prisma from "../db";

const pdfReader = new PdfReader();
function parsePdf(path : string) {
    return new Promise((resolve, reject) => {
        const pdfContent: string[] = [];
        pdfReader.parseFileItems(path, (err, item) => {
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

const addCoursesToDb = async (courseArray: Array<string>) => {
    for (const course of courseArray) {
        const addedCourse = await prisma.course.create({
            data: {
                name: course
            }
        })
        console.log(addedCourse);
    }
}


export const readPdf = async (req: Request, res: Response, next: NextFunction) => {
    let coursesCount: number = -1;
    try {
        coursesCount = await prisma.course.count();
    } catch (error) {
        console.log(error);
    }
    if (coursesCount === 0) {
        // let fecPdf = await parsePdf("../pdfFile/file0806.pdf");
        // if (typeof (pdf) === "string") {
        //     const coursePattern = /FEC\d{1,2}[\s\S]*?(?=FEC|S[1-4]|\sO\s)/g;
        //     const courses = pdf.match(coursePattern);
        //     if (courses) {
        //         const courseArray = courses.map((course) => course.trim());
        //         addCoursesToDb(courseArray);
        //         res.send(`${pdf} Working`);
        //     }
        //     else {
        //         res.status(500).send("file read error");
        //     }
        // }
        // else {
        //     res.status(500).send("File Read Error");
        // }
        let electivePdf = await parsePdf("./pdfFile/electives.pdf");
        if(typeof(electivePdf) === 'string'){
            const electivePattern = /[A-Z]{2,3}\s?\-?\s?\d{2,3}.*?(?=[A-Z]{2,3}\s?-?\s?\d{2,3})/g;
            const electives = electivePdf.match(electivePattern);
            if(electives){
                const electivesArray = electives.map((elective) => elective.trim());
                electivesArray.forEach((elective) => {
                    elective = elective.replace(/(\d\..*|Department.*|\|.*|\s+(Delhi.*|FIE-1.*|MBE ALS2.*|EC \– 329 Analog Signal Processing))/,'').trim();
                    elective = elective.replace(/\s*\d+$/,'').trim();
                    console.log(elective);
                })
            }
        }
        res.send(`${electivePdf}`);
    }
    else {
        next();
    }
};


//[A-Z]{2,3}\s?\-?\s?\d{2,3}.*?(?=[A-Z]{2,3}\s?-?\s?\d{2,3})



