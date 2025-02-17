import { getMessages } from "@/actions/rooms";
import type { Message } from "@repo/types";
import type { Socket } from "socket.io-client";
import { create } from "zustand";

export interface MessageState {
	messages: Record<string, Message[]>;
	addMessage: (roomId: string, message: Message) => void;
	setMessages: (roomId: string, messages: Message[]) => void;
	initSocket: (socket: Socket) => void;
	fetchMessages: (roomId: string, userId: string) => Promise<void>;
	initializeRoom: (roomId: string, initialMessages: Message[]) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
	messages: {},
	addMessage: (roomId, message) => {
		set((state) => ({
			messages: {
				...state.messages,
				[roomId]: [...(state.messages[roomId] || []), message],
			},
		}));
	},
	setMessages: (roomId, messages) => {
		set((state) => ({
			messages: {
				...state.messages,
				[roomId]: messages,
			},
		}));
	},
	initSocket: (socket) => {
		socket.on("message", (message: Message & { roomId: string }) => {
			get().addMessage(message.roomId, message);
		});
	},
	fetchMessages: async (roomId, userId) => {
		try {
			const res = await getMessages({ roomId, userId });
			if (res.status === 200) {
				set((state) => ({
					messages: {
						...state.messages,
						[roomId]: res.messages || [],
					},
				}));
			}
		} catch (error) {
			console.error("Error fetching messages:", error);
		}
	},

	initializeRoom: (roomId, initialMessages) => {
		set((state) => ({
			messages: {
				...state.messages,
				[roomId]: initialMessages,
			},
		}));
	},
}));
