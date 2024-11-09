import { useEffect, useState, useRef, useCallback } from 'react';
import { useSocket } from "@/context/SocketProider";
import { getMessages } from "@/actions/rooms";
import { Message } from "@/types";

export default function useListenMessages({ 
    roomId, 
    initialMessages = [], 
    userId 
}: { 
    roomId: string; 
    initialMessages?: Message[];
    userId: string;
}) {
    const { socket } = useSocket();
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const messageIdsRef = useRef(new Set<string>());

    const fetchMessages = useCallback(async () => {
        if (!userId || !roomId) return;
        
        try {
            const res = await getMessages({
                roomId,
                userId
            });
            
            if (res.status === 200) {
                const newMessages = res.messages || [];
                setMessages(newMessages);
                messageIdsRef.current = new Set(newMessages.map(m => m.messageId));
            } else {
                console.error("Failed to fetch messages:", res.message);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }, [roomId, userId]);

    useEffect(() => {
        if (initialMessages.length === 0) {
            fetchMessages();
        } else {
            messageIdsRef.current = new Set(initialMessages.map(m => m.messageId));
            setMessages(initialMessages);
        }
    }, [fetchMessages, initialMessages]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage: Message) => {
            if (!messageIdsRef.current.has(newMessage.messageId)) {
                messageIdsRef.current.add(newMessage.messageId);
                setMessages(prev => [...prev, newMessage]);
            }
        };

        socket.on("message", handleNewMessage);
        
        return () => {
            socket.off("message", handleNewMessage);
        };
    }, [socket]);

    const addMessage = useCallback((newMessage: Message) => {
        if (!messageIdsRef.current.has(newMessage.messageId)) {
            messageIdsRef.current.add(newMessage.messageId);
            setMessages(prev => [...prev, newMessage]);
        }
    }, []);

    return { 
        messages, 
        addMessage, 
        refetchMessages: fetchMessages 
    };
}