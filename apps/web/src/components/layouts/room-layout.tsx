import { getUsersAllRooms } from "@/actions/rooms";
import SignOut from "@/features/auth/components/sign-out";
import { RoomList } from "@/features/room/components/room-list";
import { RoomOperations } from "@/features/room/components/room-operations";
import { auth } from "@/server/auth";
import { RoomInfo } from "@repo/types";

export async function RoomLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	const roomsList = await getUsersAllRooms({
		userId: session?.user.userId as string,
	});
	const rooms =
		roomsList.status === 200 && roomsList.roomInfo
			? roomsList.roomInfo.map((room) => ({
					...room,
					roomId: room.roomId.toString(),
					createdBy: room.createdBy.toString(),
					users: [],
				}))
			: [];

	return (
		<div className="h-screen flex">
			<div className="w-80 border-r bg-muted/10 flex flex-col">
				<div className="p-4 border-b">
					<div className="flex items-center justify-between mb-4">
						<h1 className="font-semibold">{session?.user.username}'s Rooms</h1>
						<SignOut />
					</div>
					<div className="flex gap-2">
						<RoomOperations type="Create" />
						<RoomOperations type="Join" />
					</div>
				</div>
				<div className="flex-1 overflow-auto p-4">
					<RoomList initialRooms={rooms} />
				</div>
			</div>
			<div className="flex-1 overflow-hidden">{children}</div>
		</div>
	);
}
