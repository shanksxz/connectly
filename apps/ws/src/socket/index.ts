import http from "node:http";
import { SocketEvents } from "@repo/types";
import express from "express";
import { Server } from "socket.io";
import { authMiddleware } from "./middleware/auth.middleware";
import { SocketManager } from "./utils/socket.utils";

const app = express();
const server = http.createServer(app);

declare module "socket.io" {
	interface Socket {
		user: {
			userId: string;
			username: string;
		};
	}
}

export const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

const socketManager = new SocketManager(io);

io.use(authMiddleware);

io.on("connection", (socket) => {
	socketManager.handleConnection(socket);
});

export { server, app };
