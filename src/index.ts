import express, { Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
const app = express();
import path from "path";
import attachSocketIo from "./socket";

dotenv.config();

const server = http.createServer(app);
attachSocketIo(server);

app.get("/", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/public/index.html");
});

if (process.env.NODE_ENV === "production") {
    app.get("/app/dist/public/*", (req: Request, res: Response) => {
        res.sendFile(__dirname + req.path);
    });
} else {
    app.get("/public/*", (req: Request, res: Response) => {
        res.sendFile(__dirname + req.path);
    });
}

server.listen(process.env.PORT, () => console.log(`Server listening on http://localhost:${process.env.PORT}`));
