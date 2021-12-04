import express, { Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
const app = express();
export const server = http.createServer(app);
import "./socket/index";
import livereload from "livereload";
import path from "path";
import connectLivereload from "connect-livereload";

app.use(connectLivereload());
dotenv.config();

app.get("/", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/public/*", (req: Request, res: Response) => {
    res.sendFile(__dirname + req.path);
});

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

server.listen(process.env.PORT, () => console.log(`Server listening on http://localhost:${process.env.PORT}`));
