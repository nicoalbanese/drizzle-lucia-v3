import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "..";

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  username: text("username").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
});

export const sessions = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
});

export const adapter = new DrizzleSQLiteAdapter(db, sessions, users);
