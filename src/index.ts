import express, { Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
const app = express();
export const server = http.createServer(app);
import "./socket/index";
dotenv.config();

app.get("/", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/public/index.html");
});

server.listen(process.env.PORT, () => console.log(`Server listening on http://localhost:${process.env.PORT}`));
