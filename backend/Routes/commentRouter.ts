import { Router } from "express";
import { getComment,postComment } from "../Controllers/commentController";

export const commentRouter = Router();

commentRouter.get('/:courseName',getComment);

commentRouter.post('/:courseName',postComment);
