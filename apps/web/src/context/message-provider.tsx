"use client";
import { useMessageStore } from "@/store/messageStore";
import { type Message, SocketEvents } from "@repo/types";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect } from "react";
import { useSocket } from "./socket-provider";

interface MessageContextType {
	messages: Record<string, Message[]>;
	addMessage: (roomId: string, message: Message) => void;
	setMessages: (roomId: string, messages: Message[]) => void;
	sendMessage: (content: string, roomId: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: React.ReactNode }) {
	const { socket } = useSocket();
	const { data: session } = useSession();
	const { addMessage, setMessages } = useMessageStore();

	const sendMessage = (content: string, roomId: string) => {
		if (!socket || !session?.user) return;
		socket.emit(SocketEvents.SEND_MESSAGE, {
			content,
			roomId,
		});
	};

	useEffect(() => {
		if (!socket) return;
		const handleNewMessage = (message: Message) => {
			console.log("Received new message:", message);
			if (message.roomId) {
				addMessage(message.roomId, message);
			}
		};
		socket.on(SocketEvents.NEW_MESSAGE, handleNewMessage);
		return () => {
			socket.off(SocketEvents.NEW_MESSAGE, handleNewMessage);
		};
	}, [socket, addMessage]);

	const value = {
		messages: useMessageStore((state) => state.messages),
		addMessage,
		setMessages,
		sendMessage,
	};

	return (
		<MessageContext.Provider value={value}>{children}</MessageContext.Provider>
	);
}

export const useMessages = () => {
	const context = useContext(MessageContext);
	if (!context) {
		throw new Error("useMessages must be used within a MessageProvider");
	}
	return context;
};
