import { pgTable, serial, text, timestamp, integer, primaryKey, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 50 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password_hash: text('password_hash').notNull(),
    avatar_url: text('avatar_url'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    last_login: timestamp('last_login')
});

export const conversations = pgTable('conversations', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const participants = pgTable('participants', {
    user_id: integer('user_id').notNull().references(() => users.id),
    conversation_id: integer('conversation_id').notNull().references(() => conversations.id),
    joined_at: timestamp('joined_at').defaultNow().notNull()
}, (t) => ({
    pk: primaryKey(t.user_id, t.conversation_id)
}));

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    conversation_id: integer('conversation_id').notNull().references(() => conversations.id),
    sender_id: integer('sender_id').notNull().references(() => users.id),
    content: text('content').notNull(),
    sent_at: timestamp('sent_at').defaultNow().notNull(),
    edited_at: timestamp('edited_at')
});

// might add this feature later
// export const attachments = pgTable('attachments', {
//     id: serial('id').primaryKey(),
//     message_id: integer('message_id').notNull().references(() => messages.id),
//     file_url: text('file_url').notNull(),
//     file_type: varchar('file_type', { length: 50 }).notNull(),
//     file_size: integer('file_size').notNull(),
//     uploaded_at: timestamp('uploaded_at').defaultNow().notNull()
// });

export const read_receipts = pgTable('read_receipts', {
    user_id: integer('user_id').notNull().references(() => users.id),
    message_id: integer('message_id').notNull().references(() => messages.id),
    read_at: timestamp('read_at').defaultNow().notNull()
}, (t) => ({
    pk: primaryKey(t.user_id, t.message_id)
}));
