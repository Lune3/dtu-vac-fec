import { Router } from "express";
import { readFecFile } from "../controllers/fileIndex";
const fileIndexRoute = Router();


fileIndexRoute.get('/',readFecFile);

export default fileIndexRoute; 