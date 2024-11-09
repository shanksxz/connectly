"use server"

import { db, eq, users } from "@repo/database";

export async function getUserInfo({ userId }: { userId: string }) {
  try {
    const foo = await db
      .select()
      .from(users)
      .where(eq(users.userId, parseInt(userId)));

    return { status: 200, userInfo: foo[0] };
  } catch (error) {
    return { status: 500, message: "Internal server error" };
  }
}