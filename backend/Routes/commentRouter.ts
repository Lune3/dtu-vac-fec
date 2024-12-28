import { Router } from "express";
import { getComment,checkAuth,postComment,validateComment,deleteComment} from "../Controllers/commentController";

export const commentRouter = Router();

commentRouter.get('/:courseName',getComment);

commentRouter.post('/:courseName',checkAuth,validateComment,postComment);

commentRouter.delete('/:commentId',deleteComment);
