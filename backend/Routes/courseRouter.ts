import { Router } from "express";
import { getCourse } from "../Controllers/courseController";

export const courseRouter : Router = Router();

courseRouter.get('/:courseName',getCourse);
