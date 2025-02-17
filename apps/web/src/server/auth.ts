import { signInSchema } from "@/types";
import { db, eq, users } from "@repo/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import NextAuth, { type DefaultSession, type User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

const generateAccessToken = (user: {
	userId: string;
	email: string;
	username: string;
}) => {
	return jwt.sign(user, process.env.AUTH_SECRET as string, {
		expiresIn: "365d",
	});
};

declare module "next-auth" {
	interface Session {
		accessToken: string;
		user: {
			userId: string;
			email: string;
			username: string;
		} & DefaultSession["user"];
	}
	interface User {
		userId: string;
		username: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		accessToken: string;
		userId: string;
		email: string;
		username: string;
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	...authConfig,
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, request): Promise<User | null> {
				if (!credentials?.email || !credentials?.password) {
					// Return null instead of throwing
					return null;
				}

				try {
					const { email, password } = signInSchema.parse(credentials);
					const user = await db
						.select()
						.from(users)
						.where(eq(users.email, email));

					if (!user || user.length === 0) {
						return null;
					}

					const isPasswordValid = await bcrypt.compare(
						password,
						user[0].password as string,
					);

					if (!isPasswordValid) {
						return null;
					}

					return {
						userId: user[0].id.toString(),
						email: user[0].email,
						username: user[0].username,
					};
				} catch (error) {
					console.error("Auth error:", error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.userId = user.userId;
				token.email = user.email as string;
				token.username = user.username;
				token.accessToken = generateAccessToken({
					userId: user.userId,
					email: user.email as string,
					username: user.username,
				});
			}
			return token;
		},
		async session({ session, token }) {
			return {
				...session,
				accessToken: token.accessToken,
				user: {
					...session.user,
					userId: token.userId,
					email: token.email,
					username: token.username,
				},
			};
		},
	},
});
