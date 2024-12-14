import { Database } from "bun:sqlite";
import { BunSQLiteAdapter } from "@lucia-auth/adapter-sqlite";
export const Marks = new Database("./public/Marks.sqlite", { create: true });
export const Users = new Database("./public/Users.sqlite", { create: true });
export const adapter = new BunSQLiteAdapter(Users, {
	user: "users",
	session: "session"
});

    Users.run(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT NOT NULL PRIMARY KEY, 
            name TEXT, 
            password TEXT, 
            email TEXT, 
            show BOOLEAN NOT NULL DEFAULT TRUE
        );
        CREATE TABLE IF NOT EXISTS session (
            id TEXT NOT NULL PRIMARY KEY, 
            expires_at DATETIME NOT NULL,
            user_id TEXT NOT NULL,
            fresh BOOLEAN NOT NULL DEFAULT TRUE
        );
        CREATE TABLE IF NOT EXISTS verify (
            id TEXT NOT NULL PRIMARY KEY, 
            user_name TEXT NOT NULL, 
            user_email TEXT NOT NULL, 
            user_password TEXT NOT NULL
        );
    `);
    Marks.run(`
        CREATE TABLE IF NOT EXISTS marks (
            id TEXT NOT NULL PRIMARY KEY, 
            name TEXT, 
            position_x REAL, 
            position_y REAL, 
            type_group TEXT, 
            group_name TEXT
        );
    `);