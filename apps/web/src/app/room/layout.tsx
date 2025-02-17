import { RoomLayout } from "@/components/layouts/room-layout";

export default function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <RoomLayout>{children}</RoomLayout>;
}
