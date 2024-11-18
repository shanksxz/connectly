import { getUsersAllRooms } from "@/actions/rooms";
import RoomOperation from "@/components/room/RoomOperation";
import { auth } from "@/server/auth";
import { Button } from "@repo/ui/components/ui/button";
import { Eye, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {

    const session = await auth();

    if (!session?.user?.email) {
        redirect("/signin");
    }

    const gg = await getUsersAllRooms({ userId: session.user.userId });

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <div className="w-[500px]">
                <div className="px-6 pt-6 flex flex-row items-center justify-between space-y-0">
                    <h1 className="text-2xl font-bold">
                        {session?.user?.username || "Your Name"}'s Rooms
                    </h1>
                </div>
                <div className="grid p-6 gap-6">
                    <div className="grid gap-4">
                        {gg.roomInfo && gg.roomInfo.map((room) => (
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
                                        <div className="text-sm text-muted-foreground">{room.userCount} members</div>
                                    </div>
                                </div>
                                <Link href={`/room/${room.roomId}`} className="flex items-center justify-center">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                </Link>
                            </div>
                        ))}
                        {!gg.roomInfo && (
                            <div className="text-center h-[100px] flex justify-center items-center text-muted-foreground">
                                You don't have any rooms yet
                            </div>
                        )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <RoomOperation type="Create" userId={session.user.userId} />
                        <RoomOperation type="Join" userId={session.user.userId} />
                    </div>
                </div>
            </div>
        </div>
    )
}
