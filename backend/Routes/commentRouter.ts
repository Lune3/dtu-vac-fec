import { Router } from "express";
import { getComment,checkAuth,postComment,validateComment } from "../Controllers/commentController";

export const commentRouter = Router();

commentRouter.get('/:courseName',getComment);

commentRouter.post('/:courseName',checkAuth,validateComment,postComment);
