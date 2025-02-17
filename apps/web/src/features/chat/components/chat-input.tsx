"use client";

import { useMessages } from "@/context/message-provider";
import { useSocket } from "@/context/socket-provider";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";

export default function ChatInput({ roomId }: { roomId: string }) {
	const [newMessage, setNewMessage] = useState("");
	const { isConnected } = useSocket();
	const { sendMessage } = useMessages();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim() || !isConnected || isSubmitting) return;
		setIsSubmitting(true);
		try {
			sendMessage(newMessage, roomId);
			setNewMessage("");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex items-center space-x-2 p-4 w-full"
		>
			<Input
				type="text"
				placeholder={isConnected ? "Type a message..." : "Connecting..."}
				value={newMessage}
				onChange={(e) => setNewMessage(e.target.value)}
				disabled={!isConnected || isSubmitting}
				className="flex-grow"
			/>
			<Button
				type="submit"
				size="icon"
				disabled={!isConnected || isSubmitting || !newMessage.trim()}
			>
				<Send className={`h-4 w-4 ${isSubmitting ? "animate-pulse" : ""}`} />
				<span className="sr-only">Send message</span>
			</Button>
		</form>
	);
}
