'use client'

import { useRef, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ScrollArea } from "@repo/ui/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { Button } from "@repo/ui/components/ui/button"
import { Input } from "@repo/ui/components/ui/input"
import { ArrowLeft, Send, Undo2, Users } from "lucide-react"
import useListenMessages from '@/hooks/useListenMessages'
import { Message, RoomInfo } from '@/types'
import ChatMessage from './ChatMessages'
import Link from 'next/link'

export default function ChatLayout({ roomId, initialMessages = [], roomInfo, userId }: { roomId: string; initialMessages?: Message[]; roomInfo: RoomInfo, userId: string }) {
    const { data: session } = useSession()
    const { messages, addMessage } = useListenMessages({ roomId, initialMessages, userId })
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const [newMessage, setNewMessage] = useState('')

    const handleSendMessage = async (content: string) => {
        try {
            const res = await fetch('http://localhost:8787/api/messages', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content, roomId })
            })

            if (!res.ok) {
                throw new Error('Error while sending message')
            }

            const data = await res.json()
            addMessage(data.message)
            setNewMessage('')
        } catch (error) {
            console.error('Failed to send message:', error)
        }
    }

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
    }, [messages])

    return (
        <Card className="w-full h-full max-w-lg mx-auto flex flex-col">
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
                    <span className="text-sm text-muted-foreground">{messages.length} messages</span>
                </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-0">
                <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-12rem)] p-4">
                    {messages.map((message) => (
                        <ChatMessage
                            userName={session?.user.username || 'You'}
                            key={message.messageId}
                            message={message}
                            isUser={session?.user.userId === message.userId}
                        />
                    ))}
                </ScrollArea>
            </CardContent>
            <CardFooter className="border-t p-4">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(newMessage); }} className="flex w-full gap-2">
                    <Input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-grow"
                    />
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send message</span>
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}
