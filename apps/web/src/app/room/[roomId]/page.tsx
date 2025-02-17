import { getMessages, getRoomInfo } from "@/actions/rooms";
import ChatLayout from "@/features/chat/components/chat-layout";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Page({
	params,
}: {
	params: {
		roomId: string;
	};
}) {
	const { roomId } = await params;
	const session = await auth();

	if (!session?.user?.email) {
		redirect("/auth/signin");
	}

	const initialMessages = await getMessages({
		roomId,
		userId: session.user.userId,
	});
	const roomInfo = await getRoomInfo({ roomId });

	if (
		initialMessages.status !== 200 ||
		!initialMessages.messages ||
		roomInfo.status !== 200 ||
		!roomInfo.roomInfo
	) {
		redirect("/");
	}

	return (
		<ChatLayout
			initialMessages={initialMessages.messages}
			roomInfo={{ ...roomInfo.roomInfo, roomId }}
		/>
	);
}
