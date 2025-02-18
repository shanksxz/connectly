"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { LogOut, MoreVertical, Share2, Trash } from "lucide-react";
import { toast } from "sonner";

interface RoomDropdownProps {
	isCreator: boolean;
	roomId: string;
}

export function RoomDropdown({ isCreator, roomId }: RoomDropdownProps) {
	const handleShare = async () => {
		try {
			const shareLink = `${window.location.origin}/room/${roomId}`;
			await navigator.clipboard.writeText(shareLink);
			toast.info("Link copied to clipboard.");
		} catch (error) {
			toast.error("Failed to copy link to clipboard.");
		}
	};

	//TODO: implement handleLeave and handleDelete
	const handleLeave = () => {};
	const handleDelete = () => {};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<MoreVertical className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={handleShare}
					className="flex items-center gap-2"
				>
					<Share2 className="h-4 w-4" />
					Share Room
				</DropdownMenuItem>
				{isCreator ? (
					<DropdownMenuItem
						disabled
						onClick={handleDelete}
						className="flex items-center gap-2 text-destructive"
					>
						<Trash className="h-4 w-4" />
						Delete Room
					</DropdownMenuItem>
				) : (
					<DropdownMenuItem
						disabled
						onClick={handleLeave}
						className="flex items-center gap-2 text-destructive"
					>
						<LogOut className="h-4 w-4" />
						Leave Room
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
