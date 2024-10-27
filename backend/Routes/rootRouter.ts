import { Router } from "express";
import { readPdf } from "../Controllers/readPdf";
import rootController from "../Controllers/rootController";

const rootRouter = Router();

rootRouter.get('/', readPdf,rootController);

export default rootRouter;
