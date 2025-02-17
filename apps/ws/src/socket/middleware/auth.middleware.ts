import jwt from "jsonwebtoken";
import type { Socket } from "socket.io";
import { getEnvVariable } from "../../utils";

export function authMiddleware(socket: Socket, next: (err?: Error) => void) {
	try {
		const token = socket.handshake.auth.token;
		if (!token) {
			throw new Error("Authentication error: No token provided");
		}
		const decoded = jwt.verify(token, getEnvVariable("JWT_SECRET"));
		socket.user = decoded as { userId: string; username: string };
		next();
	} catch (error) {
		next(new Error("Authentication error"));
	}
}
