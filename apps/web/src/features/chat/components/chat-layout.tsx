'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ScrollArea } from "@repo/ui/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { ArrowLeft, Users } from "lucide-react"
import { Message, RoomInfo, SocketEvents } from '@repo/types'
import ChatMessage from './chat-message'
import ChatInput from './chat-input'
import Link from 'next/link'
import { useSocket } from '@/context/socket-provider'
import { useMessages } from '@/context/message-provider'
import { verifyRoomAccess } from '@/actions/rooms'
import { toast } from 'sonner';
import { useRoomStore } from '@/store/roomStore'
import { UserPayload } from '@repo/types'

export default function ChatLayout({ 
    initialMessages = [], 
    roomInfo, 
}: { 
    initialMessages: Message[]; 
    roomInfo: RoomInfo;
}) {
    const { data: session } = useSession()
    const { socket, isConnected } = useSocket()
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const { messages, setMessages } = useMessages()
    const currentMessages = messages[roomInfo.roomId] || []
    const [isRoomJoined, setIsRoomJoined] = useState(false)
    const { onlineUsers, setRoomOnlineUsers } = useRoomStore();
    const roomOnlineUsers = onlineUsers[roomInfo.roomId] || [];
    const scrollToBottom = useCallback(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, []);
    useEffect(() => {
        if (!socket || !isConnected || !session?.user) return;
        const joinRoom = async () => {
            try {
                const result = await verifyRoomAccess({ 
                    roomId: roomInfo.roomId, 
                    userId: session.user.userId 
                });

                if (result.status !== 200) {
                    toast.error(result.message);
                    return;
                }
                socket.emit(SocketEvents.JOIN_ROOM, { roomId: roomInfo.roomId });
                setIsRoomJoined(true);
                setMessages(roomInfo.roomId, initialMessages);
                setTimeout(scrollToBottom, 100);
            } catch (error) {
                toast.error("Failed to join room");
            }
        };
        joinRoom();
        return () => {
            if (isRoomJoined) {
                socket.emit(SocketEvents.LEAVE_ROOM, { roomId: roomInfo.roomId });
                setIsRoomJoined(false);
            }
        };
    }, [socket, isConnected, roomInfo.roomId, session?.user]);
    useEffect(() => {
        scrollToBottom();
    }, [currentMessages, scrollToBottom]);
    useEffect(() => {
        if (!socket) return;
        const handleRoomUsersOnline = ({ roomId, users }: { roomId: string; users: UserPayload[] }) => {
            if (roomId === roomInfo.roomId) {
                setRoomOnlineUsers(roomId, users);
            }
        };
        socket.on(SocketEvents.ROOM_USERS_ONLINE, handleRoomUsersOnline);
        return () => {
            socket.off(SocketEvents.ROOM_USERS_ONLINE, handleRoomUsersOnline);
        };
    }, [socket, roomInfo.roomId, setRoomOnlineUsers]);
    if (!isRoomJoined) {
        return <div className='flex items-center justify-center h-full'>
            Loading Chats...
        </div>
    }
    return (
        <Card className="w-full rounded-none h-full flex flex-col">
            <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                    <div className='flex items-center gap-2'>
                        <Link href="/" className='hover:cursor-pointer'>
                            <ArrowLeft className="h-5 w-5" />
                            <span className="sr-only">Go back</span>
                        </Link>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            {roomInfo.roomName}
                        </CardTitle>
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {currentMessages.length} messages
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            {roomOnlineUsers.length} online
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-0">
                <ScrollArea 
                    ref={scrollAreaRef} 
                    className="h-[calc(100vh-12rem)] p-4"
                >
                    {currentMessages.map((message) => (
                        <ChatMessage
                            key={message.messageId}
                            message={message}
                            isUser={session?.user.userId === message.userId}
                            userName={session?.user.username || 'You'}
                        />
                    ))}
                </ScrollArea>
            </CardContent>
            <CardFooter className="border-t p-0">
                <ChatInput roomId={roomInfo.roomId} />
            </CardFooter>
        </Card>
    )
}
