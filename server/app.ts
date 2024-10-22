require('dotenv').config();
import express from "express";
import * as fs from "fs";
import { Prisma } from "@prisma/client";
import { PdfReader } from "pdfreader";

const app = express();

app.get('/', async (req,res) => {
    
})

app.listen(process.env.PORT || 3000,() => {
    console.log('Server Running');
})



