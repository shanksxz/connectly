import { getUsersAllRooms } from "@/actions/rooms";
import SignOut from "@/features/auth/components/sign-out";
import { RoomList } from "@/features/room/components/room-list";
import { RoomOperations } from "@/features/room/components/room-operations";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default function Page() {
	return (
		<div className="h-full flex items-center justify-center text-muted-foreground">
			Select a room or create a new one
		</div>
	);
}
