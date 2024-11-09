import { and, db, eq, messages, userRooms } from "@repo/database";

interface foo {
  roomId: string;
  userId: string;
}

export async function check({ roomId, userId }: foo) {
  try {
    const check = await db
      .select()
      .from(userRooms)
      .where(
        and(
          eq(userRooms.userId, parseInt(userId)),
          eq(userRooms.roomId, parseInt(roomId)),
        ),
      );
    if (check.length === 0) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
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
      .select()
      .from(messages)
      .where(eq(messages.roomId, parseInt(roomId)));

    const boo = foo.map((message) => {
      return {
        messageId: message.messageId.toString(),
        userId: message.userId.toString(),
        roomId: message.roomId.toString(),
        content: message.content,
        sentAt: message.sentAt,
      };
    });

    return { status: 200, messages: boo };
  } catch (error) {
    return { status: 500, message: "Internal server error" };
  }
}


export async function sendMessage({ roomId, userId, content }: { roomId: string; userId: string; content: string }) {
  try {
    // is user in the room?
    const inRoom = await check({ roomId, userId });

    if (!inRoom) {
      return { status: 403, message: "Forbidden" };
    }

    // now we are sure user is in the room
    // insert message into messages table
    const foo = await db
      .insert(messages)
      .values({
        roomId: parseInt(roomId),
        userId: parseInt(userId),
        content,
      })
      .returning();

    return { status: 200, message: foo[0] };
  } catch (error) {
    return { status: 500, message: "Internal server error" };
  }
}