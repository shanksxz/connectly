import { and, db, eq, userRooms } from "@repo/database";
import { SocketEvents } from "@repo/types";
import type { Socket } from "socket.io";
import { io } from "../index";
import { conversationManager } from "../utils/conversation.utils";

export async function handleJoinConversation(
	socket: Socket,
	{ roomId }: { roomId: string },
) {
	try {
		const inRoom = await db
			.select()
			.from(userRooms)
			.where(
				and(
					eq(userRooms.userId, Number.parseInt(socket.user.userId)),
					eq(userRooms.roomId, Number.parseInt(roomId)),
				),
			);

		if (inRoom.length === 0) {
			socket.emit(SocketEvents.ERROR, "Not a member of this room");
			return;
		}

		conversationManager.addUserToConversation(roomId, socket.user.userId);
		socket.join(roomId);

		const users = conversationManager.getConversationUsers(roomId);
		io.to(roomId).emit(SocketEvents.CONVERSATION_USERS_ONLINE, {
			roomId,
			users: users.map((userId) => ({
				userId,
				userName: socket.user.username,
			})),
		});

		socket.to(roomId).emit(SocketEvents.USER_JOINED, {
			userId: socket.user.userId,
			userName: socket.user.username,
		});
	} catch (error) {
		socket.emit(SocketEvents.ERROR, "Failed to join conversation");
	}
}

export function handleLeaveConversation(
	socket: Socket,
	{ roomId }: { roomId: string },
) {
	socket.leave(roomId);
	conversationManager.removeUserFromConversation(roomId, socket.user.userId);

	const users = conversationManager.getConversationUsers(roomId);
	io.to(roomId).emit(SocketEvents.CONVERSATION_USERS_ONLINE, {
		roomId,
		users: users.map((userId) => ({
			userId,
			userName: socket.user.username,
		})),
	});

	socket.to(roomId).emit(SocketEvents.USER_LEFT, socket.user.userId);
}
