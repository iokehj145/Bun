import { Database } from "bun:sqlite";
import { BunSQLiteAdapter } from "@lucia-auth/adapter-sqlite";
export const Users = new Database("./Users.sqlite", { create: true });
Users.run(`CREATE TABLE IF NOT EXISTS users (id TEXT NOT NULL PRIMARY KEY, name TEXT, password TEXT, email TEXT, show BOOLEAN NOT NULL DEFAULT TRUE)`);
Users.run(`CREATE TABLE IF NOT EXISTS session 
(id TEXT NOT NULL PRIMARY KEY, expires_at DATETIME NOT NULL, user_id TEXT NOT NULL, fresh BOOLEAN NOT NULL DEFAULT TRUE)`);
export const adapter = new BunSQLiteAdapter(Users, {
	user: "users",
	session: "session"
});
export interface User {
    name: string;
    password: string;
    email: string;
    show?: boolean;
}
export type Checker = 1 | 2 | null;
export const check = (user: User) => {
    if (Users.query(`SELECT * FROM users WHERE name = '${user.name}'`).all().length > 0) {
        return 1;
    }
    else if (Users.query(`SELECT * FROM users WHERE email = '${user.email}'`).all().length > 0) {
        return 2;
    }
    else {
        return null;
    }
};
export const AddUser = (user: User, id:string) => {
    Users.run(`INSERT INTO users (id, name, password, email) VALUES ('${id}', '${user.name}', '${user.password}', '${user.email}')`);
    console.log(`Add user ${user.name}, email ${user.email}, password ${user.password}`)
};
export const GetUser = (ID: string) => {
    return Users.query(`SELECT * FROM users WHERE id = '${ID}'`).get();
};
export const GetUsers = () => {
    return Users.query("SELECT * FROM users").all();
};
export const IsShow = (id: string) => {
    return Users.run(`UPDATE users SET show = NOT show WHERE id = '${id}';`);
};