import type { Message } from "@repo/types";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";

export default function ChatMessage({
	message,
	isUser,
	userName,
}: { message: Message; isUser: boolean; userName: string }) {
	return (
		<div
			className={`flex items-end space-x-2 mb-4 ${isUser ? "justify-end" : "justify-start"}`}
		>
			{!isUser && (
				<Avatar className="w-8 h-8 flex-shrink-0">
					<AvatarFallback>
						{message?.userName?.slice(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
			)}
			<div
				className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[75%]`}
			>
				<div
					className={`p-3 rounded-2xl ${
						isUser
							? "bg-primary text-primary-foreground rounded-br-sm"
							: "bg-secondary text-secondary-foreground rounded-bl-sm"
					} shadow-md`}
				>
					<p className="text-sm break-words">{message.content}</p>
				</div>
				<span className="text-xs text-muted-foreground mt-1 px-1">
					{new Date(message.sentAt).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</span>
			</div>
			{isUser && (
				<Avatar className="w-8 h-8 flex-shrink-0">
					<AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
				</Avatar>
			)}
		</div>
	);
}
