import { SocketProvider } from "@/context/socket-provider";
import { Provider } from "@/providers/provider";
import "@repo/ui/globals.css";
// import { SocketEventsHandler } from "@/components/socket-events-handler"
import { RoomLayout } from "@/components/layouts/room-layout";
import { MessageProvider } from "@/context/message-provider";
import { font } from "@/utils";
import { Toaster } from "sonner";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${font.className} bg-background`}>
				<Provider>
					<SocketProvider>
						{/* <SocketEventsHandler /> */}
						<MessageProvider>
							<RoomLayout>{children}</RoomLayout>
						</MessageProvider>
					</SocketProvider>
				</Provider>
				<Toaster />
			</body>
		</html>
	);
}
