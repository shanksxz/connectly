"use client";

import type React from "react";

import { createRoom, joinRoom } from "@/actions/rooms";
import { Button } from "@repo/ui/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { Input } from "@repo/ui/components/ui/input";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function RoomOperations({ type }: { type: "Create" | "Join" }) {
	const [isOpen, setIsOpen] = useState(false);
	const [roomId, setRoomId] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { data: session } = useSession();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isLoading) return;

		setIsLoading(true);
		try {
			if (type === "Create") {
				const response = await createRoom({
					roomName: roomId,
					userId: session?.user.userId as string,
				});

				if (response.status === 200) {
					toast.success("Room created successfully");
					router.refresh();
					setIsOpen(false);
					setRoomId("");
					router.push(`/room/${response.roomId}`);
				} else {
					toast.error(response.message || "Failed to create room");
				}
			} else {
				const response = await joinRoom({
					roomId,
					userId: session?.user.userId as string,
				});

				if (response.status === 200) {
					toast.success("Joined room successfully");
					router.refresh();
					setIsOpen(false);
					setRoomId("");
					router.push(`/room/${roomId}`);
				} else {
					toast.error(response.message || "Failed to join room");
				}
			}
		} catch (error) {
			toast.error(`Failed to ${type.toLowerCase()} room`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					className="w-full flex items-center gap-2"
					variant={type === "Create" ? "default" : "secondary"}
				>
					<Plus className="h-4 w-4" />
					{type} Room
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{type === "Create" ? "Create a new room" : "Join a room"}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<label htmlFor="roomName">
								{type === "Create" ? "Room Name" : "Room ID"}
							</label>
							<Input
								id="roomName"
								name="roomName"
								required
								value={roomId}
								onChange={(e) => setRoomId(e.target.value)}
								disabled={isLoading}
							/>
						</div>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Loading..." : `${type} Room`}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
