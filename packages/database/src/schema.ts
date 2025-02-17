import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("user", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name"),
	username: text("username").unique().notNull(),
	password: text("password"),
	email: text("email").unique(),
	emailVerified: timestamp("emailVerified", { mode: "date" }),
	image: text("image"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const accounts = pgTable(
	"account",
	{
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	}),
);

export const sessions = pgTable("session", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
	"verificationToken",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { mode: "date" }).notNull(),
	},
	(verificationToken) => ({
		compositePk: primaryKey({
			columns: [verificationToken.identifier, verificationToken.token],
		}),
	}),
);

export const authenticators = pgTable(
	"authenticator",
	{
		credentialID: text("credentialID").notNull().unique(),
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		providerAccountId: text("providerAccountId").notNull(),
		credentialPublicKey: text("credentialPublicKey").notNull(),
		counter: integer("counter").notNull(),
		credentialDeviceType: text("credentialDeviceType").notNull(),
		credentialBackedUp: boolean("credentialBackedUp").notNull(),
		transports: text("transports"),
	},
	(authenticator) => ({
		compositePK: primaryKey({
			columns: [authenticator.userId, authenticator.credentialID],
		}),
	}),
);

export const rooms = pgTable("rooms", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	roomName: text("roomName").notNull().unique(),
	createdBy: text("created_by")
		.notNull()
		.references(() => users.id),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	roomId: text("roomId")
		.notNull()
		.references(() => rooms.id),
	userId: text("userId")
		.notNull()
		.references(() => users.id),
	content: text("content").notNull(),
	sentAt: timestamp("sentAt").notNull().defaultNow(),
});

export const userRooms = pgTable(
	"user_rooms",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id),
		roomId: text("room_id")
			.notNull()
			.references(() => rooms.id),
		joinedAt: timestamp("joinedAt").notNull().defaultNow(),
	},
	(table) => ({
		pk: primaryKey(table.userId, table.roomId),
	}),
);

export const roomsRelations = relations(rooms, ({ many, one }) => ({
	messages: many(messages),
	userRooms: many(userRooms),
	creator: one(users, {
		fields: [rooms.createdBy],
		references: [users.id],
	}),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
	user: one(users, {
		fields: [messages.userId],
		references: [users.id],
	}),
	room: one(rooms, {
		fields: [messages.roomId],
		references: [rooms.id],
	}),
}));

export const userRoomsRelations = relations(userRooms, ({ one }) => ({
	user: one(users, {
		fields: [userRooms.userId],
		references: [users.id],
	}),
	room: one(rooms, {
		fields: [userRooms.roomId],
		references: [rooms.id],
	}),
}));

export const usersRelations = relations(users, ({ many }) => ({
	messages: many(messages),
	createdRooms: many(rooms),
}));
