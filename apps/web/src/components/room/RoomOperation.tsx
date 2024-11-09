"use client"

import { Button } from "@repo/ui/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/components/ui/dialog";
import { Input } from "@repo/ui/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom, joinRoom } from "@/actions/rooms";
import { toast } from "sonner";

const RoomOperation = ({ type, userId }: { type: "Create" | "Join", userId: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [roomId, setRoomId] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (type === 'Create') {
                await createRoom({ roomName: roomId, userId });
                toast.success('Room created successfully');
            } else {
                console.log(roomId, userId);
                const res = await joinRoom({ roomId, userId });
                if(res.status !== 200) {
                    toast.error(res.message);
                    return;
                } else {
                    toast.success(res.message);
                }
            }

            setIsOpen(false);
            setRoomId('');
            router.refresh();
        } catch (error) {
            toast.error('Failed to ' + type.toLowerCase() + ' room');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-full"
                    variant={type === "Create" ? "default" : "secondary"}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    {type} Room
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {type === 'Create' ? 'Create a new room' : 'Join a room'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="roomName">Room Name</label>
                            <Input
                                id="roomName"
                                name="roomName"
                                required
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                            />
                        </div>
                        <Button type="submit">
                            {type} Room
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RoomOperation;