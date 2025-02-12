import express from "express";
import http from "node:http";
import { Server, type Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { getEnvVariable } from "../utils";
import { db, eq, messages, userRooms, users, and, rooms } from "@repo/database";
import { SocketEvents } from "@repo/types";

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

const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

const roomUsersMap = new Map<string, Set<string>>();

async function handleSendMessage(socket: Socket, message: { content: string; roomId: string }) {
	try {
		const { content, roomId } = message;
		const senderId = socket.user.userId;
		const inRoom = await db
			.select()
			.from(userRooms)
			.where(and(
				eq(userRooms.userId, Number.parseInt(senderId)),
				eq(userRooms.roomId, Number.parseInt(roomId))
			));

		if (!inRoom.length) {
			socket.emit(SocketEvents.ERROR, "Not a member of this room");
			return;
		}

		const [newMessage] = await db
			.insert(messages)
			.values({
				roomId: Number.parseInt(roomId),
				userId: Number.parseInt(senderId),
				content,
			})
			.returning();

		const messageToSend = {
			messageId: newMessage.messageId.toString(),
			userId: newMessage.userId.toString(),
			roomId: newMessage.roomId.toString(),
			content: newMessage.content,
			sentAt: newMessage.sentAt,
			userName: socket.user.username,
		};

		console.log('Emitting message to room:', roomId, messageToSend);
		io.to(roomId).emit(SocketEvents.NEW_MESSAGE, messageToSend);
	} catch (error) {
		console.error('Error sending message:', error);
		socket.emit(SocketEvents.ERROR, "Failed to send message");
	}
}

async function handleJoinRoom(socket: Socket, { roomId }: { roomId: string }) {
	try {
		const inRoom = await db
			.select()
			.from(userRooms)
			.where(and(
				eq(userRooms.userId, Number.parseInt(socket.user.userId)),
				eq(userRooms.roomId, Number.parseInt(roomId))
			));

		if (inRoom.length === 0) {
			socket.emit(SocketEvents.ERROR, "Not a member of this room");
			return;
		}

		const rooms = socket.rooms;
		if (rooms.has(roomId)) {
			return;
		}

		if (!roomUsersMap.has(roomId)) {
			roomUsersMap.set(roomId, new Set());
		}
		roomUsersMap.get(roomId)?.add(socket.user.userId);

		socket.join(roomId);
		console.log(`User ${socket.user.username} joined room ${roomId}`);
		
		io.to(roomId).emit(SocketEvents.ROOM_USERS_ONLINE, {
			roomId,
			users: Array.from(roomUsersMap.get(roomId) || []).map(userId => ({
				userId,
				userName: socket.user.username
			}))
		});

		socket.to(roomId).emit(SocketEvents.USER_JOINED, {
			userId: socket.user.userId,
			userName: socket.user.username
		});
	} catch (error) {
		console.error('Error joining room:', error);
		socket.emit(SocketEvents.ERROR, "Failed to join room");
	}
}

io.use((socket, next) => {
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
});

io.on("connection", (socket) => {
	try {
		socket.on(SocketEvents.JOIN_ROOM, (data) => handleJoinRoom(socket, data));
		socket.on(SocketEvents.LEAVE_ROOM, ({ roomId }) => {
			socket.leave(roomId);
			roomUsersMap.get(roomId)?.delete(socket.user.userId);
			if (roomUsersMap.get(roomId)?.size === 0) {
				roomUsersMap.delete(roomId);
			}
			io.to(roomId).emit(SocketEvents.ROOM_USERS_ONLINE, {
				roomId,
				users: Array.from(roomUsersMap.get(roomId) || []).map(userId => ({
					userId,
					userName: socket.user.username
				}))
			});
			console.log(`User ${socket.user.username} left room ${roomId}`);
			socket.to(roomId).emit(SocketEvents.USER_LEFT, socket.user.userId);
		});

		socket.on(SocketEvents.SEND_MESSAGE, (message) => handleSendMessage(socket, message));
		socket.on("disconnect", () => {
			for (const [roomId, users] of roomUsersMap.entries()) {
				if (users.has(socket.user.userId)) {
					users.delete(socket.user.userId);
					if (users.size === 0) {
						roomUsersMap.delete(roomId);
					}
					io.to(roomId).emit(SocketEvents.ROOM_USERS_ONLINE, {
						roomId,
						users: Array.from(users).map(userId => ({
							userId,
							userName: socket.user.username
						}))
					});
				}
			}
		});
	} catch (error) {
		socket.emit(SocketEvents.ERROR, "An unexpected error occurred");
	}
});

export { io, server, app };
