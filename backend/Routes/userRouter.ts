import { Router } from "express";
import { getUser } from "../Controllers/userController";

export const userRouter = Router();

userRouter.get('/',getUser);