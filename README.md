# Real-time Chat Application

A real-time chat application built with Next.js, Socket.IO, and PostgreSQL in a Turborepo monorepo.

## Core Architecture

### Key Concepts

#### Room vs Conversation
- **Room**: Permanent chat space
  - Stored in database (userRooms table)
  - Users must be members to access
  - Created via room creation or joining with room ID
  
- **Conversation**: Active chat session
  - Temporary socket connection
  - Only active when user is viewing the chat
  - Tracks currently online users

### Data Flow

1. **Room Membership**
```typescript
// user joins room - permanent (DB)
await joinRoom({ roomId, userId })

// user views chat - temporary (Socket)
socket.emit(SocketEvents.JOIN_CONVERSATION, { roomId })
```

2. **Messaging**
```typescript
// send message
socket.emit(SocketEvents.SEND_MESSAGE, { content, roomId })

// receive messages
socket.on(SocketEvents.NEW_MESSAGE, (message) => {
})
```

### Socket Events
```typescript
enum SocketEvents {
    JOIN_CONVERSATION = "joinConversation",
    LEAVE_CONVERSATION = "leaveConversation",
    SEND_MESSAGE = "sendMessage",
    NEW_MESSAGE = "newMessage",
    CONVERSATION_USERS_ONLINE = "conversationUsersOnline"
}
```

## Project Structure

### Apps

- `web/`: Next.js frontend application
  - `features/chat/`: Chat UI components
  - `features/room/`: Room management
  - `context/`: Socket and message providers
  - `actions/`: Server actions for DB operations

- `ws/`: Socket.IO server
  - Handles real-time messaging
  - Manages active conversations
  - Tracks online users

### Packages

- `@repo/database`: Database schema and utilities
- `@repo/ui`: Shared UI components
- `@repo/types`: Shared TypeScript types
- `@repo/typescript-config`: TypeScript configurations

## Development

1. Start the development servers:
```bash
pnpm dev
```

2. Create a room:
   - Click "Create Room"
   - Enter room name
   - Share room ID with others

3. Join a room:
   - Click "Join Room"
   - Enter room ID
   - Start chatting

## Technical Details

### Database Schema
```sql
users       - User accounts
rooms       - Chat rooms
userRooms   - Room membership (many-to-many)
messages    - Chat messages
```

### State Management
- `roomStore`: Room list and online users
- `messageStore`: Chat messages
- `MessageProvider`: Message handling logic

## Turborepo Features

# Turborepo starter

This is an official starter Turborepo.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
