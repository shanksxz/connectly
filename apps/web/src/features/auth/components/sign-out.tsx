'use client'

import { signOut } from 'next-auth/react'
import { Button } from "@repo/ui/components/ui/button"
import { LogOut } from 'lucide-react'

export default function SignOut() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/signin' })
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleSignOut}
      className="text-muted-foreground hover:text-foreground"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  )
}
