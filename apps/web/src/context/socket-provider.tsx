"use client";

import { io, Socket } from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface SocketContextType {
	socket: Socket | null;
	isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
	const { data: session, status } = useSession();
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		if (status === "unauthenticated" || !session?.accessToken) {
			return;
		}

		const socket = io("http://localhost:8787", {
			auth: {
				token: session.accessToken,
			},
			transports: ["websocket"],
		});

		socket.on("connect", () => {
			console.log("Connected to socket server");
			setIsConnected(true);
		});

		socket.on("disconnect", () => {
			console.log("Disconnected from socket server");
			setIsConnected(false);
		});

		setSocket(socket);

		return () => {
			socket.close();
			setSocket(null);
		};
	}, [session?.accessToken, status]);

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>
			{children}
		</SocketContext.Provider>
	);
}

export const useSocket = () => {
	const context = useContext(SocketContext);
	if (context === undefined) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return context;
};

