import type { RoomInfo, UserPayload } from "@repo/types";
import { create } from "zustand";

interface RoomState {
	rooms: RoomInfo[];
	currentRoom: RoomInfo | null;
	setRooms: (rooms: RoomInfo[]) => void;
	addRoom: (room: RoomInfo) => void;
	setCurrentRoom: (room: RoomInfo | null) => void;
	updateRoom: (roomId: string, updates: Partial<RoomInfo>) => void;
	removeRoom: (roomId: string) => void;
	onlineUsers: Record<string, UserPayload[]>;
	setRoomOnlineUsers: (roomId: string, users: UserPayload[]) => void;
}

export const useRoomStore = create<RoomState>()((set) => ({
	rooms: [],
	currentRoom: null,
	setRooms: (rooms) => set({ rooms }),
	addRoom: (room) =>
		set((state) => ({
			rooms: [...state.rooms, room],
		})),
	setCurrentRoom: (room) => set({ currentRoom: room }),
	updateRoom: (roomId, updates) =>
		set((state) => ({
			rooms: state.rooms.map((room) =>
				room.roomId === roomId ? { ...room, ...updates } : room,
			),
		})),
	removeRoom: (roomId) =>
		set((state) => ({
			rooms: state.rooms.filter((room) => room.roomId !== roomId),
		})),
	onlineUsers: {},
	setRoomOnlineUsers: (roomId, users) =>
		set((state) => ({
			onlineUsers: {
				...state.onlineUsers,
				[roomId]: users,
			},
		})),
}));
