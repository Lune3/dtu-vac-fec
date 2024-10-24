import { Router } from "express";
import { readPdf } from "../Controllers/fileIndexController";

const fileIndex = Router();

fileIndex.get('/', readPdf);

export default fileIndex;
