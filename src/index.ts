import express, { Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
const app = express();
import livereload from "livereload";
import path from "path";
import connectLivereload from "connect-livereload";
import attachSocketIo from "./socket";

app.use(connectLivereload());
dotenv.config();

const server = http.createServer(app);
attachSocketIo(server);

app.get("/", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/public/*", (req: Request, res: Response) => {
    res.sendFile(__dirname + req.path);
});

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

server.listen(process.env.PORT, () => console.log(`Server listening on http://localhost:${process.env.PORT}`));
