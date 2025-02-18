"use server";
import { and, db, eq, messages, rooms, userRooms, users } from "@repo/database";

// get chat messages for an particular room
interface foo {
	roomId: string;
	userId: string;
}

export async function check({ roomId, userId }: foo) {
	try {
		const check = await db
			.select()
			.from(userRooms)
			.where(and(eq(userRooms.userId, userId), eq(userRooms.roomId, roomId)));
		if (check.length === 0) {
			return false;
		}
		return true;
	} catch (error) {
		return false;
	}
}

export async function createRoom({
	roomName,
	userId,
}: {
	roomName: string;
	userId: string;
}) {
	try {
		// check if room already exists
		const isRoomExists = await db
			.select()
			.from(rooms)
			.where(eq(rooms.roomName, roomName));

		if (isRoomExists.length > 0) {
			return { status: 409, message: "Room already exists" };
		}

		// create a new room
		const foo = await db
			.insert(rooms)
			.values({
				roomName,
				createdBy: userId,
			})
			.returning();

		// add user to the room
		await db
			.insert(userRooms)
			.values({
				userId,
				roomId: foo[0].id,
			})
			.returning();

		return { status: 200, roomId: foo[0].id };
	} catch (error) {
		return { status: 500, message: "Internal server error" };
	}
}

export async function joinRoom({ roomId, userId }: foo) {
	try {
		const isRoomExists = await db
			.select()
			.from(rooms)
			.where(eq(rooms.id, roomId));

		if (isRoomExists.length === 0) {
			return { status: 404, message: "Room not found" };
		}

		const inRoom = await check({ roomId, userId });
		if (inRoom) {
			return { status: 200, message: "Already in the room" };
		}

		await db
			.insert(userRooms)
			.values({
				userId,
				roomId,
			})
			.returning();

		return {
			status: 200,
			message: "User added to the room",
			roomInfo: isRoomExists[0],
		};
	} catch (error) {
		return { status: 500, message: "Internal server error" };
	}
}

export async function deleteRoom(roomId: string, userId: string) {
	try {
		const room = await db.select().from(rooms).where(eq(rooms.id, roomId));

		if (room.length === 0) {
			return { status: 404, message: "Room not found" };
		}

		if (room[0].createdBy !== userId) {
			return { status: 403, message: "Not authorized to delete this room" };
		}

		await db.delete(rooms).where(eq(rooms.id, roomId));

		return { status: 200, message: "Room deleted successfully" };
	} catch (error) {
		return { status: 500, message: "Internal server error" };
	}
}

export async function getMessages({ roomId, userId }: foo) {
	try {
		// is user in the room?
		console.log("dhvbdvjdv", roomId, userId);
		const inRoom = await check({ roomId, userId });

		if (!inRoom) {
			return { status: 403, message: "Forbidden" };
		}

		const foo = await db
			.select({
				messageId: messages.id,
				userId: messages.userId,
				roomId: messages.roomId,
				content: messages.content,
				sentAt: messages.sentAt,
				userName: users.username,
			})
			.from(messages)
			.innerJoin(users, eq(messages.userId, users.id))
			.where(eq(messages.roomId, roomId))
			.orderBy(messages.sentAt);

		const boo = foo.map((message) => {
			return {
				id: message.messageId.toString(),
				userId: message.userId.toString(),
				roomId: message.roomId.toString(),
				content: message.content,
				sentAt: message.sentAt,
				userName: message.userName,
			};
		});

		return { status: 200, messages: boo };
	} catch (error) {
		return { status: 500, message: "Internal server error" };
	}
}

export async function getRoomName({ roomId }: { roomId: string }) {
	const foo = await db.select().from(rooms).where(eq(rooms.id, roomId));
	return foo[0].roomName;
}

export async function getRoomInfo({ roomId }: { roomId: string }) {
	try {
		const foo = await db.select().from(rooms).where(eq(rooms.id, roomId));

		const user_info = await db
			.select({
				userId: users.id,
				userName: users.username,
			})
			.from(userRooms)
			.innerJoin(users, eq(userRooms.userId, users.id))
			.where(eq(userRooms.roomId, roomId));

		const bar = foo.map((room) => {
			return {
				roomName: room.roomName,
				createdBy: room.createdBy.toLocaleString(),
				createdAt: room.createdAt,
				users: user_info.map((user) => ({
					userId: user.userId.toLocaleString(),
					userName: user.userName,
				})),
			};
		});

		return { status: 200, roomInfo: bar[0] };
	} catch (error) {
		return { status: 500, message: "Internal server error" };
	}
}

export async function getUsersRoom({ userId }: { userId: string }) {
	try {
		const foo = await db
			.select({
				roomId: rooms.id,
				roomName: rooms.roomName,
				createdBy: rooms.createdBy,
				createdAt: rooms.createdAt,
				userCount: db.$count(userRooms, eq(userRooms.roomId, rooms.id)),
			})
			.from(rooms)
			.innerJoin(userRooms, eq(rooms.id, userRooms.roomId))
			.where(
				and(
					eq(rooms.createdBy, userRooms.userId),
					eq(userRooms.userId, userId),
				),
			);

		if (foo.length === 0) {
			return { status: 404, message: "Room not found" };
		}

		console.log(foo);
		return { status: 200, roomInfo: foo };
	} catch (error) {
		console.log(error);
		return { status: 500, message: "Internal server error" };
	}
}

export async function getUsersAllRooms({ userId }: { userId: string }) {
	try {
		const foo = await db
			.select({
				id: rooms.id,
				roomName: rooms.roomName,
				createdBy: rooms.createdBy,
				createdAt: rooms.createdAt,
				userCount: db.$count(userRooms, eq(userRooms.roomId, rooms.id)),
			})
			.from(rooms)
			.innerJoin(userRooms, eq(rooms.id, userRooms.roomId))
			.where(eq(userRooms.userId, userId));

		if (foo.length === 0) {
			return { status: 404, message: "Room not found" };
		}
		console.log("kk", foo);
		return { status: 200, roomInfo: foo };
	} catch (error) {
		return { status: 500, message: "Internal server error" };
	}
}

export async function leaveRoom({ roomId, userId }: foo) {
	try {
		const inRoom = await check({ roomId, userId });
		if (!inRoom) {
			return { status: 404, message: "Not in room" };
		}

		await db
			.delete(userRooms)
			.where(and(eq(userRooms.userId, userId), eq(userRooms.roomId, roomId)));

		return { status: 200, message: "Left room successfully" };
	} catch (error) {
		return { status: 500, message: "Internal server error" };
	}
}

export async function verifyRoomAccess({ roomId, userId }: foo) {
	try {
		const inRoom = await check({ roomId, userId });
		if (!inRoom) {
			return { status: 403, message: "Not a member of this room" };
		}

		const gg = await db.select().from(rooms).where(eq(rooms.id, roomId));

		if (gg.length === 0) {
			return { status: 404, message: "Room not found" };
		}

		return { status: 200, roomInfo: gg[0] };
	} catch (error) {
		return { status: 500, message: "Internal server error" };
	}
}
