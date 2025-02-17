import { z } from "zod";
import { messages, rooms, users, userRooms, type InferSelectModel } from "@repo/database";

export type DBUser = InferSelectModel<typeof users>;
export type DBRoom = InferSelectModel<typeof rooms>;
export type DBMessage = InferSelectModel<typeof messages>;
export type DBUserRoom = InferSelectModel<typeof userRooms>;

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

export interface User {
    userId: string;
    username: DBUser["username"];
    email: DBUser["email"];
    createdAt: DBUser["createdAt"];
}

export interface Room extends Omit<DBRoom, "roomId" | "createdBy"> {
    roomId: string;
    createdBy: string;
}

export interface RoomInfo extends Room {
    users: {
        userId: string;
        userName: string;
    }[];
}

export interface Message extends Omit<DBMessage, "messageId" | "userId" | "roomId"> {
    messageId: string;
    userId: string;
    roomId: string;
    userName: string;
}

export const createRoomSchema = z.object({
    roomName: z.string()
        .min(1, "Room name is required")
        .max(32, "Room name must be less than 32 characters"),
});

export const messageSchema = z.object({
    content: z.string()
        .min(1, "Message cannot be empty")
        .max(1000, "Message is too long"),
    roomId: z.string(),
});

export enum SocketEvents {
    ROOM_MESSAGES = "roomMessages",
    ONLINE_USERS = "onlineUsers",
    JOIN_CONVERSATION = "joinConversation",
    LEAVE_CONVERSATION = "leaveConversation",
    USER_JOINED = "userJoined",
    USER_LEFT = "userLeft",
    SEND_MESSAGE = "sendMessage",
    NEW_MESSAGE = "newMessage",
    ERROR = "error",
    CONVERSATION_USERS_ONLINE = "conversationUsersOnline",
}

export interface MessagePayload {
    content: string;
    roomId: string;
}

export interface UserPayload {
    userId: string;
    userName: string;
}

export interface ServerToClientEvents {
    [SocketEvents.NEW_MESSAGE]: (message: Message) => void;
    [SocketEvents.USER_JOINED]: (user: UserPayload) => void;
    [SocketEvents.USER_LEFT]: (userId: string) => void;
    [SocketEvents.ERROR]: (error: string) => void;
    [SocketEvents.CONVERSATION_USERS_ONLINE]: (data: { roomId: string; users: UserPayload[] }) => void;
}

export interface ClientToServerEvents {
    [SocketEvents.JOIN_CONVERSATION]: (data: { roomId: string }) => void;
    [SocketEvents.LEAVE_CONVERSATION]: (data: { roomId: string }) => void;
    [SocketEvents.SEND_MESSAGE]: (message: MessagePayload) => void;
}

export interface ApiResponse<T = undefined> {
    status: number;
    message?: string;
    data?: T;
    error?: string;
}

export type SignInSchemaType = z.infer<typeof signInSchema>;
export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type CreateRoomSchemaType = z.infer<typeof createRoomSchema>;
export type MessageSchemaType = z.infer<typeof messageSchema>; 