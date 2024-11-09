import { getMessages, getRoomInfo } from "@/actions/rooms";
import ChatLayout from "@/components/Chat/ChatLayout";
import { auth } from "@/server/auth"
import { redirect } from "next/navigation";

export default async function Page({ params }: {
    params: {
        roomId: string
    }
}) {

    const session = await auth();

    if (!session?.user?.email) {
        redirect("/auth/signin");
    }

    const initialMessages = await getMessages({ roomId: params.roomId, userId: session.user.userId });
    const roomInfo = await getRoomInfo({ roomId: params.roomId });

    if (initialMessages.status !== 200 || !initialMessages.messages || roomInfo.status !== 200 || !roomInfo.roomInfo) {
        redirect("/room");
    }

    return (
        <section className="p-5 h-dvh w-dvw">
            <ChatLayout
                initialMessages={initialMessages.messages}
                roomId={params.roomId}
                roomInfo={roomInfo.roomInfo}
                userId={session.user.userId}
            />
        </section>
    )
}