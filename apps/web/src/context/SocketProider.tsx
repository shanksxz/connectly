"use client"

import { io, Socket } from "socket.io-client"
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface SocketContextType {
    socket : Socket | null
    onlineUsers : string[];
    isConnected : boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children } : { children : React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const { data : session, status } = useSession();

    useEffect(() => {
        if(status === "unauthenticated" || !session?.accessToken) {
            return;
        }

        const newSocket = io("http://localhost:8787", {
            auth : {
                token : session.accessToken
            },
            transports : ["websocket"]
        });

        newSocket.on("connect", () => {
            console.log("Connected to socket server");
            setIsConnected(true);
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected from socket server");
            setIsConnected(false);
        });

        newSocket.on("onlineUsers", (users : string[]) => {
            console.log("Online users", users);
            setOnlineUsers(users);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        }

    }, [session?.accessToken]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, isConnected }}>
            {children}
        </SocketContext.Provider>
    )

}


export const useSocket = () => {
    const context = useContext(SocketContext);
    if(context === undefined) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
}