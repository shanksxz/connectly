// 'use client'

// import { useSocket } from "@/context/SocketProider"
// import { useRoomStore } from "@/store/roomStore"
// import { SocketEvents } from "@repo/types"
// import { useEffect } from "react"
// import { toast } from "sonner"

// export function SocketEventsHandler() {
//     const { socket } = useSocket()
//     const { currentRoom, updateRoom } = useRoomStore()

//     useEffect(() => {
//         if (!socket) return

//         const handleUserJoined = ({ userId, userName, roomId }: { userId: string; userName: string; roomId: string }) => {
//             if (currentRoom?.roomId === roomId) {
//                 toast.info(`${userName} joined the room`)
//                 updateRoom(roomId, {
//                     users: [...(currentRoom.users || []), { userId, userName }]
//                 })
//             }
//         }

//         const handleUserLeft = ({ userId, userName, roomId }: { userId: string; userName: string; roomId: string }) => {
//             if (currentRoom?.roomId === roomId) {
//                 toast.info(`${userName} left the room`)
//                 updateRoom(roomId, {
//                     users: currentRoom.users.filter(u => u.userId !== userId)
//                 })
//             }
//         }

//         const handleError = (error: string) => {
//             toast.error(error)
//         }

//         socket.on(SocketEvents.USER_JOINED, handleUserJoined)
//         socket.on(SocketEvents.USER_LEFT, handleUserLeft)
//         socket.on(SocketEvents.ERROR, handleError)

//         return () => {
//             socket.off(SocketEvents.USER_JOINED, handleUserJoined)
//             socket.off(SocketEvents.USER_LEFT, handleUserLeft)
//             socket.off(SocketEvents.ERROR, handleError)
//         }
//     }, [socket, currentRoom, updateRoom])

//     return null
// } 