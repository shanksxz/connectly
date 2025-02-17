import { SocketEvents } from "@repo/types";
import type { Server, Socket } from "socket.io";
import {
	handleJoinConversation,
	handleLeaveConversation,
} from "../handlers/conversation.handler";
import { handleSendMessage } from "../handlers/message.handler";
import { conversationManager } from "./conversation.utils";

export class SocketManager {
	private io: Server;

	constructor(io: Server) {
		this.io = io;
	}

	handleConnection(socket: Socket) {
		try {
			this.setupEventListeners(socket);
			this.handleDisconnect(socket);
		} catch (error) {
			socket.emit(SocketEvents.ERROR, "An unexpected error occurred");
		}
	}

	private setupEventListeners(socket: Socket) {
		socket.on(SocketEvents.JOIN_CONVERSATION, (data) =>
			handleJoinConversation(socket, data),
		);

		socket.on(SocketEvents.LEAVE_CONVERSATION, (data) =>
			handleLeaveConversation(socket, data),
		);

		socket.on(SocketEvents.SEND_MESSAGE, (message) =>
			handleSendMessage(socket, message),
		);
	}

	private handleDisconnect(socket: Socket) {
		socket.on("disconnect", () => {
			conversationManager.cleanup(socket.user.userId);
		});
	}

	broadcastToRoom(roomId: string, event: SocketEvents, data: any) {
		this.io.to(roomId).emit(event, data);
	}

	broadcastToUser(userId: string, event: SocketEvents, data: any) {
		const socket = Array.from(this.io.sockets.sockets.values()).find(
			(socket) => socket.user?.userId === userId,
		);
		if (socket) {
			socket.emit(event, data);
		}
	}
}
