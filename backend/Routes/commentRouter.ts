import { Router } from "express";
import { getComment,postComment,validateComment } from "../Controllers/commentController";

export const commentRouter = Router();

commentRouter.get('/:courseName',getComment);

commentRouter.post('/:courseName',validateComment,postComment);
