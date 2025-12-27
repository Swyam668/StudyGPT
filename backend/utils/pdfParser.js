import fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';


// this returns a Promise of object {text: string, numPages: number}

export const extractTextFromPDF = async (filePath) => {
    try{
        // this data read from file is binary
        const dataBuffer = await fs.readFile(filePath);
        // creating parser instance and for this we have to give unsigned 8 bits array -- storing data as list of bytes (8 bit) 
        const parser = new PDFParse(new Uint8Array(dataBuffer));
        const data = await parser.getText();

        return {
            text: data.text,
            numPages: data.numPages,
            info: data.info,
        };
    }
    catch(error){
        console.error("PDF parsing error: ", error);
        // some function (say f) in document routes will call it, so if error occurs we cant simply console log it, but we gotta throw it as well, so that we can catch it in the function f and handle or send json response with success: false 
        throw new Error("Failed to extract text from PDF");
    }
};