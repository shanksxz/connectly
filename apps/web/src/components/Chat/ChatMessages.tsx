import { Message } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";

export default function ChatMessage({ message, isUser, userName }: { message: Message; isUser: boolean, userName: string }) {
    return (
    <div className={`flex items-start space-x-2 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="w-8 h-8">
          {/* <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.userId}`} /> */}
          <AvatarFallback>{message.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`p-3 rounded-lg ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-none'
              : 'bg-secondary text-secondary-foreground rounded-bl-none'
          } shadow-sm max-w-[70%]`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      {isUser && (
        <Avatar className="w-8 h-8">
          {/* <AvatarImage src={session?.user.image || `https://api.dicebear.com/6.x/initials/svg?seed=${session?.user.name}`} /> */}
          <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}