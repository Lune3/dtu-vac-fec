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

function isElectiveId(extractId : string) : boolean{
    const courseIdPattern = /(CE|CH|MC|CS|CO|SE|ME|PE|AE|EN|EP|EE|EC|BT|IT|MGT|MGS|MGM|NST|MSPH|BBA|DD|FB|FIE|FSE|MGK|HU|DD)[\s\-]?\d{3}/g;

    const firstResult = courseIdPattern.test(extractId);
    if(firstResult === true)return true;
    return false;
}


function extractElectives(electivePdf : string) : Array<string> {
    const electivesArray : string[] = [];
    
    for(let i = 0;i < electivePdf.length - 6;i++){
        const extractId = electivePdf.slice(i,i + 6).trimEnd();
        const checkElectiveId : boolean = isElectiveId(extractId);
        if(checkElectiveId){
            electivesArray.push(extractId);
        }
    }

    return electivesArray;
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
            const electiveCode = extractElectives(electivePdf);
            console.log(electiveCode);
        }
        res.send(`${electivePdf}`);
    }
    else {
        next();
    }
};



