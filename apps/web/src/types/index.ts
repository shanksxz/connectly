import { z } from "zod";

export const signInSchema = z.object({
  email: z.string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z.string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const signUpSchema = z.object({
    email: z.string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    username: z.string({ required_error: "Username is required" })
        .min(1, "Username is required")
        .max(32, "Username must be less than 32 characters"),
    password: z.string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
});

export interface Message {
    content: string;
    userId: string;
    messageId: string;
    roomId: string;
    sentAt: Date;
}

export interface RoomInfo {
    roomName: string;
    createdBy: string;
    createdAt: Date;
    users: string[];
}

export type signUpSchemaType = z.infer<typeof signUpSchema>;
export type signInSchemaType = z.infer<typeof signInSchema>;