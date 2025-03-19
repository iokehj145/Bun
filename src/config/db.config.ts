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
            id INTEGER NOT NULL PRIMARY KEY, 
            name TEXT,
            position_x REAL,
            position_y REAL,
            ray INTEGER,
            type_group INTEGER
        );
        CREATE TABLE IF NOT EXISTS offers (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT NOT NULL,
            position_x REAL NOT NULL,
            position_y REAL NOT NULL,
            ray INTEGER NOT NULL,
            type_group INTEGER NOT NULL,
            image BLOB NOT NULL
        );
        CREATE TABLE IF NOT EXISTS images (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            image BLOB NOT NULL
        )
    `);