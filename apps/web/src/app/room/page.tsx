import { MessageSquarePlus } from "lucide-react";

export default function NoRoomSelected() {
  return (
    <div className="flex w-full flex-col items-center justify-center h-dvh text-center px-4">
      <MessageSquarePlus className="h-24 w-24 text-gray-400 mb-6" />
      <h2 className="text-2xl font-bold text-primary mb-2">
        No Chat Room Selected
      </h2>
      <p className="text-secondary mb-8 max-w-md">
        Select a chat room from the sidebar or create a new one to start
        messaging.
      </p>
    </div>
  );
}
