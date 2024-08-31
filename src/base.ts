import { Database } from "bun:sqlite";
import { BunSQLiteAdapter } from "@lucia-auth/adapter-sqlite";
export const Users = new Database("./Users.sqlite", { create: true });
Users.run(`CREATE TABLE IF NOT EXISTS users (id TEXT NOT NULL PRIMARY KEY, name TEXT, password TEXT, email TEXT, show BOOLEAN NOT NULL DEFAULT TRUE)`);
Users.run(`CREATE TABLE IF NOT EXISTS session (id TEXT NOT NULL PRIMARY KEY, expires_at DATETIME NOT NULL, 
    user_id TEXT NOT NULL, fresh BOOLEAN NOT NULL DEFAULT TRUE)`);
Users.run(`CREATE TABLE IF NOT EXISTS verify (id TEXT NOT NULL PRIMARY KEY, 
    user_name TEXT NOT NULL, user_email TEXT NOT NULL, user_password TEXT NOT NULL)`);
export const adapter = new BunSQLiteAdapter(Users, {
	user: "users",
	session: "session"
});
export interface User {
    name: string;
    password: string;
    email?: string;
    show?: boolean;
    id?: string;
};
export type Checker = number | null | undefined;
export const check = (user: User) : Checker => {
    if (Users.query(`SELECT * FROM users WHERE name = '${user.name}'`).all().length > 0) {
        return 1;
    }
    else if (Users.query(`SELECT * FROM users WHERE email = '${user.email}'`).all().length > 0) {
        return 2;
    }
    else if (Users.query(`SELECT * FROM verify WHERE user_name = '${user.name}'`).all().length > 0) {
        return 3;
    }
    else if (Users.query(`SELECT * FROM verify WHERE user_email = '${user.email}'`).all().length > 0) {
        return 4;
    }
    else {
        return null;
    }
};
export const AddUser = (user: User) : string => {
    Users.run(`INSERT INTO users (id, name, password, email) VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM users),'${user.name}', '${user.password}', '${user.email}');`);
    console.log(`Add user ${user.name}, email ${user.email}, password ${user.password}`)
    const result:any = Users.query(`SELECT MAX(id) AS id FROM users`).all();
    if (typeof result[0].id === "string") {
        return result[0].id;
    }
    else{ return ""; }
};
export const EmailVerify = (user: User, id:string): void => {
    Users.run(`INSERT INTO verify (id, user_name, user_email, user_password) VALUES ('${id}', '${user.name}', '${user.email}', '${user.password}');`)
}
export const RemoveVerify = (id: string) : void => {
    Users.run("DELETE FROM verify WHERE id = '"+ id +"';");
}
export type VerifyRecord2 = {
    id: string;
    user_name: string;
    user_email: string;
    user_password: string;
}

export const EmailVerifyCheck = (id: string) : object | null | unknown => {
    const result: Array<VerifyRecord2> = Users.query("SELECT * FROM verify WHERE id = '"+ id +"'").all(id) as VerifyRecord2[];
    if (result.length === 0 || result[0] === undefined) {
        return null;
    }
    else {
        Users.run("DELETE FROM verify WHERE id = '"+ id +"';");
        return result[0] as VerifyRecord2;
    }
}
export const logIn = (user: User): string | undefined | null => {
    const TheUser: User = Object(Users.query(`SELECT * FROM users WHERE name = '${user.name}' AND password = '${user.password}'`).all()[0]);
    if(!TheUser.name && Users.query(`SELECT * FROM users WHERE name = '${user.name}'`).all().length > 0) {
        return null
    }
    Users.run(`UPDATE users SET show = TRUE WHERE id = '${TheUser.id}';`);
    const answear:any = Users.query(`SELECT id FROM session WHERE user_id = '${TheUser.id}'`).all()[0];
    if( answear !== undefined)
    {   
        if(answear.id){
            return answear.id;
        }
    }
    else { return undefined }
}
export const GetUser = (ID: string) => {
    return Users.query(`SELECT * FROM users WHERE id = '${ID}'`).get();
};
export const GetUsers = () => {
    return Users.query("SELECT * FROM users").all();
};
export const IsShow = (ID: string) => {
    return Users.run(`UPDATE users SET show = NOT show WHERE id = '${ID}';`);
};