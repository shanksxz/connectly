import { RoomInfo } from "@repo/types"
import { Eye, Users } from "lucide-react"
import Link from "next/link"

interface RoomWithUserCount extends RoomInfo {
    userCount: number
}

export function RoomList({ initialRooms }: { initialRooms: RoomWithUserCount[] }) {
    return (
        <div className="grid gap-4">
            {initialRooms.length > 0 ? (
                initialRooms.map((room) => (
                    <div
                        key={room.roomId}
                        className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-primary/10 p-2">
                                <Users className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <div className="font-medium">{room.roomName}</div>
                                <div className="text-sm text-muted-foreground">
                                    {room.userCount} members
                                </div>
                            </div>
                        </div>
                        <Link 
                            href={`/room/${room.roomId}`} 
                            className="flex items-center justify-center"
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                        </Link>
                    </div>
                ))
            ) : (
                <div className="text-center h-[100px] flex justify-center items-center text-muted-foreground">
                    You don't have any rooms yet
                </div>
            )}
        </div>
    )
} 