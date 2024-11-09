import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { useState } from "react";

export default function ChatInput({ onSendMessage }: { onSendMessage: (content: string) => void }){
    const [newMessage, setNewMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-4">
            <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}

            />
            <Button type="submit" className="border-white text-white bg-transparent border-2">
                Send 
            </Button>
        </form>
    );
};