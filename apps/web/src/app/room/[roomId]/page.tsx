import { getMessages, getRoomInfo } from "@/actions/rooms";
import ChatLayout from "@/components/Chat/ChatLayout";
import { auth } from "@/server/auth"
import { redirect } from "next/navigation";

export default async function Page({ params }: {
    params: {
        roomId: string
    }
}) {

    const {
        roomId
    } = await params;
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/auth/signin");
    }

    const initialMessages = await getMessages({ roomId, userId: session.user.userId });
    const roomInfo = await getRoomInfo({ roomId });

    if (initialMessages.status !== 200 || !initialMessages.messages || roomInfo.status !== 200 || !roomInfo.roomInfo) {
        redirect("/");
    }

    return (
        <section className="p-5 h-dvh w-dvw">
            <ChatLayout
                initialMessages={initialMessages.messages}
                roomId={roomId}
                roomInfo={roomInfo.roomInfo}
                userId={session.user.userId}
            />
        </section>
    )
}