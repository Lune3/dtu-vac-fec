import { Request, Response, NextFunction } from "express";
import { resolve } from "path";
import { PdfReader } from "pdfreader"; // Assuming you're using pdf-reader

const pdfReader = new PdfReader();

export const readFecFile = async (req: Request, res: Response, next: NextFunction) => {

    const parsePdf = () => {
        return new Promise((resolve,reject) => {
            const pdfContent :string [] = [];
            pdfReader.parseFileItems("../public/file0806.pdf", (err, item) => {
                if (err) {
                    reject(err);
                } else if (!item) {
                    resolve(pdfContent.join("")); // End of file, join all parts
                } else if (item.text) {
                    pdfContent.push(item.text); // Collect the text
                }
            });
        });
    }

    let pdf = await parsePdf();
    
    if(typeof(pdf) === "string"){
        let trimPdf : string = pdf;
        const coursePattern = /FEC\d+[A-Za-z]+/g;
        const courses = trimPdf.match(coursePattern);
        if (courses) {
            const courseArray = courses.map((course) => course.trim());
            console.log(courseArray);
        }
    }



    // Now send the parsed text after everything is done
    res.send(`${pdf}Hello`);
};
