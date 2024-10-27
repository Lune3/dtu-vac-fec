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
    }
}

export const readPdf = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const coursesCount = await prisma.course.count();
        if (coursesCount === 0) {
            console.log("in zero count");
            let fecPdf = await parsePdf("./pdfFile/file0806.pdf");
            if (typeof (fecPdf) === "string") {
                const coursePattern = /FEC\d{1,2}[\s\S]*?(?=FEC|S[1-4]|\sO\s)/g;
                const courses = fecPdf.match(coursePattern);
                if (courses) {
                    const courseArray = courses.map((course) => course.trim());
                    const uniqueFecArray = [... new Set(courseArray)];
                    addCoursesToDb(uniqueFecArray);
                }
                else {
                    res.status(500).send("file read error");
                }
            }
            else {
                res.status(500).send("File Read Error");
            }
            let electivePdf = await parsePdf("./pdfFile/electives.pdf");
            if(typeof(electivePdf) === 'string'){
                const electivePattern = /[A-Z]{2,3}\s?\-?\s?\d{2,3}.*?(?=[A-Z]{2,3}\s?-?\s?\d{2,3})/g;
                const electives = electivePdf.match(electivePattern);
                if(electives){
                    const electivesArray = electives.map((elective) => {
                        elective = elective.replace(/(\d\..*|Department.*|\|.*|\s+(Delhi.*|FIE-1.*|MBE ALS2.*|EC \– 329 Analog Signal Processing))/,'');
                        elective = elective.replace(/\s*\d+$/,'').trim();
                        const courseCode = elective.match(/[A-Z]{2,3}\s?\-?\s?\d{2,3}/g);
                        elective = elective.replace(/[A-Z]{2,3}\s?\-?\s?\d{2,3}/g,'');
                        if(courseCode){
                            courseCode[0] = courseCode[0].replace(/(\s|\-)/g,'');
                            elective = courseCode[0] + elective;
                        }
                        return elective;
                    });
                    const uniqueElectivesArray = [...new Set(electivesArray)];
                    addCoursesToDb(uniqueElectivesArray);
                }
                else{
                    res.status(500).send("File read error");
                }
            }
            else{
                res.status(500).send("File read error");
            }
        }
        next();
    } 
    catch (error) {
        console.log(error);
    }
};





