import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db, eq, users } from "@repo/database";
import { signUpSchema } from "@/types";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const { email, username, password } = signUpSchema.parse(await req.json());

    // check if user already exists
    const user = await db.select().from(users).where(eq(users.email, email));

    if (user.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    await db.insert(users).values({
      email,
      username,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "Account created successfully", status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }
  }
}
