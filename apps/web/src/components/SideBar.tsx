import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Hash } from "lucide-react";
import { getUsersRoom } from "@/actions/rooms";
import Link from "next/link";
import { auth } from "@/server/auth";

export default async function SideBar() {
    const session = await auth();
    if(!session?.user?.userId) return null;
    const res = await getUsersRoom({ userId: session?.user.userId });
    const chatRooms = res.roomInfo || [];

    return (
        <div className="w-80 h-dvh border-r-4">
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>
                            {session?.user?.username?.charAt(0).toUpperCase() || "F"}
                        </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-sm">
                        {session?.user?.username || "Your Name"}
                    </span>
                </div>
            </div>
            <ScrollArea className="flex-1 px-4">
                {chatRooms.map((room) => (
                    <Link
                        key={room.roomId}
                        href={`/room/${room.roomId}`}
                        className="flex items-center w-full py-2 px-2 text-left mb-1 rounded hover:bg-primary hover:text-black"
                    >
                        <Hash className="mr-2 h-4 w-4" />
                        <span className="flex-1 text-sm font-medium">{room.roomName}</span>
                    </Link>
                ))}
            </ScrollArea>
        </div>
    );
}
