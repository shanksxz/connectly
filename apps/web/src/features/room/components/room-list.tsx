import { auth } from "@/server/auth";
import type { RoomInfo } from "@repo/types";
import { Avatar } from "@repo/ui/components/ui/avatar";
import { AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Users } from "lucide-react";
import Link from "next/link";
import { RoomDropdown } from "./room-dropdown";

interface RoomWithUserCount extends RoomInfo {
	userCount: number;
}

export async function RoomList({
	initialRooms,
}: {
	initialRooms: RoomWithUserCount[];
}) {
	console.log(initialRooms);
	const session = await auth();
	return (
		<div className="space-y-4">
			{initialRooms.map((room) => (
				<div key={room.id} className="p-4 rounded-lg border bg-card">
					<div className="flex items-center justify-between">
						<Link
							href={`/room/${room.id}`}
							className="flex-1 flex items-center gap-3"
						>
							<Avatar className="h-10 w-10 bg-primary/10">
								<AvatarFallback className="text-primary">
									{room.roomName.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div>
								<h3 className="font-medium">{room.roomName}</h3>
								<p className="text-sm text-muted-foreground flex items-center gap-1">
									<Users className="h-3 w-3" />
									{room.userCount || 0} members
								</p>
							</div>
						</Link>
						<RoomDropdown
							isCreator={session?.user?.userId === room.createdBy}
							roomId={room.id}
						/>
					</div>
				</div>
			))}
		</div>
	);
}
