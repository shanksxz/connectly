import { Request, Response } from "express";
import { z } from "zod";
import { and, db, eq, messages, userRooms, users } from "@repo/database";
import { getUsersInRoom, io } from "../socket";

const messageSchema = z.object({
  roomId: z.string(),
  content: z.string(),
});

async function getUserName(userId: string) {
  const foo = await db
    .select()
    .from(users)
    .where(eq(users.userId, parseInt(userId)));

  return foo[0].username;
}

export async function sendMessage(req: Request, res: Response) {
  try {
    // get roomId and text from request body
    const { roomId, content } = messageSchema.parse(req.body);

    const senderId = req.user.userId;

    console.log("roomId", roomId);
    console.log("text", content);
    console.log("senderId", senderId);

    // is user in the room?
    const check = await db
      .select()
      .from(userRooms)
      .where(
        and(
          eq(userRooms.userId, parseInt(senderId)),
          eq(userRooms.roomId, parseInt(roomId))
        )
      );

    if (check.length === 0) {
      res.status(403).json({ message: "Forbidden" });
    }

    // now we are sure user is in the room
    // insert message into messages table
    const foo = await db
      .insert(messages)
      .values({
        roomId: parseInt(roomId),
        userId: parseInt(senderId),
        content,
      })
      .returning();

    // send message to all users in the room
    const socketIds = await getUsersInRoom(roomId);
    const senderUsername = await getUserName(senderId);
    console.log(senderUsername);
    socketIds.forEach((socketId) => {
      io.to(socketId).emit("message", {
        roomId,
        userId: senderId,
        content,
        sentAt: foo[0].sentAt,
        messageId: foo[0].messageId,
        userName: senderUsername
      });
    });

    res.status(200).json({ message: foo[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: "Validation error", details: error.errors });
    }
  }
}

export async function getMessages(req: Request, res: Response) {
  try {
    const roomId = req.params.roomId;
    const userId = req.user.userId;

    // is user in the room?
    const check = await db
      .select()
      .from(userRooms)
      .where(
        and(
          eq(userRooms.userId, parseInt(userId)),
          eq(userRooms.roomId, parseInt(roomId))
        )
      );

    if (check.length === 0) {
      res.status(403).json({ message: "Forbidden" });
    }

    // get messages from messages table
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.roomId, parseInt(roomId)));

    res.status(200).json({ messages: msgs });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
