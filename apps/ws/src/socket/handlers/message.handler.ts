import { and, db, eq, messages, userRooms } from "@repo/database";
import { SocketEvents } from "@repo/types";
import type { Socket } from "socket.io";
import { io } from "../index";

export async function handleSendMessage(
	socket: Socket,
	message: { content: string; roomId: string },
) {
	try {
		const { content, roomId } = message;
		const senderId = socket.user.userId;

		const inRoom = await db
			.select()
			.from(userRooms)
			.where(and(eq(userRooms.userId, senderId), eq(userRooms.roomId, roomId)));

		if (!inRoom.length) {
			socket.emit(SocketEvents.ERROR, "Not a member of this room");
			return;
		}

		const [newMessage] = await db
			.insert(messages)
			.values({
				roomId,
				userId: senderId,
				content,
			})
			.returning();

		const messageToSend = {
			id: newMessage.id.toString(),
			userId: newMessage.userId.toString(),
			roomId: newMessage.roomId.toString(),
			content: newMessage.content,
			sentAt: newMessage.sentAt,
			userName: socket.user.username,
		};

		io.to(roomId).emit(SocketEvents.NEW_MESSAGE, messageToSend);
	} catch (error) {
		socket.emit(SocketEvents.ERROR, "Failed to send message");
	}
}
