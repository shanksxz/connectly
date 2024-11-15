import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db, eq, users } from "@repo/database";
import { JWT } from "next-auth/jwt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signInSchema } from "@/types";

const generateAccessToken = (user: {
  userId: string;
  email: string;
  username: string;
}) => {
  return jwt.sign(user, process.env.AUTH_SECRET!, { expiresIn: "365d" });
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
    // id: string;
    // email: string;
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

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  trustHost: true,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request): Promise<any | null> {
        if (!credentials?.email || !credentials?.password) {
          console.error("Credentials are missing");
          return null;
        }

        try {
          const { email, password } = signInSchema.parse(credentials);

          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

          if (!user || user.length === 0) return null;

          const isPasswordValid = await bcrypt.compare(
            password,
            user[0].password
          );

          if (!isPasswordValid) {
            console.error("Password is invalid");
          }
          console.log(user[0]);

          return {
            userId: user[0].userId.toString(),
            email: user[0].email,
            username: user[0].username,
          };
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.userId!;
        token.email = user.email!;
        token.username = user.username;
        //! might be tottaly wrong
        token.accessToken = generateAccessToken({
          userId: user.userId,
          email: user.email!,
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
