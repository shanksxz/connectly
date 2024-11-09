import { SocketProvider } from "@/context/SocketProider"
import { Provider } from "@/providers/provider"
import "@repo/ui/globals.css"
import { font } from "@/utils"
import { Toaster } from "sonner"


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${font.className}`}>
                <Provider>
                    <SocketProvider>
                            {children}
                    </SocketProvider>
                </Provider>
                <Toaster />
            </body>
        </html>
    )
}