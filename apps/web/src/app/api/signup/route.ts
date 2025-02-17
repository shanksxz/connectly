import { signUpSchema } from "@/types";
import { db, eq, users } from "@repo/database";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
	try {
		const { email, username, password } = signUpSchema.parse(await req.json());

		// check if user already exists
		const isUser = await db.select().from(users).where(eq(users.email, email));

		// check if username already exists
		const isUserNameExists = await db
			.select()
			.from(users)
			.where(eq(users.username, username));

		if (isUserNameExists.length > 0) {
			return NextResponse.json(
				{ error: "Username already exists" },
				{ status: 400 },
			);
		}

		if (isUser.length > 0) {
			return NextResponse.json(
				{ error: "User already exists" },
				{ status: 400 },
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

		return NextResponse.json({
			message: "Account created successfully",
			status: 200,
		});
	} catch (error) {
		if (error instanceof ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}
		console.log(error);
		return NextResponse.json(
			{ error: "Failed to create account" },
			{ status: 500 },
		);
	}
}
