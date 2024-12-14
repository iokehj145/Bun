import * as face from '../Interfaces/UserInterface';
import { Users } from "../config/db.config";

export const check = (user: face.User) : face.Checker => {
    if (Users.query(`SELECT * FROM users WHERE name = '${user.name}'`).all().length > 0)
         return 1;
    else if (Users.query(`SELECT * FROM users WHERE email = '${user.email}'`).all().length > 0)
         return 2;
    else if (Users.query(`SELECT * FROM verify WHERE user_name = '${user.name}'`).all().length > 0)
         return 3;
    else if (Users.query(`SELECT * FROM verify WHERE user_email = '${user.email}'`).all().length > 0)
         return 4;
    else return null;
};

export const AddUser = (user: face.User) : string => {
    Users.run(`INSERT INTO users (id, name, password, email) VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM users),'${user.name}', '${user.password}', '${user.email}');`);
    console.log(`Add user ${user.name}, email ${user.email}, password ${user.password}`)
    const result:any = Users.query(`SELECT MAX(id) AS id FROM users`).all();
    if  (typeof result[0].id === "string")
         return result[0].id;
    else return "";
};
export const GetUserGoogle = (email: string) : face.GoogleUser => {
    try{
    const user: face.User[] = Users.query(`SELECT * FROM users WHERE email = '${email}'`).all() as face.User[];
    if (user[0]) {
        Users.run(`UPDATE users SET show = TRUE WHERE id = '${user[0].id}';`);
        return {user : user[0], success : true};
    };
} catch (error) {return null}
    Users.run(`INSERT INTO users (id, name, password, email) VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM users),'${email.split("@gmail.com")[0]}', NULL, '${email}');`);
    const result: face.User[] = Users.query(`SELECT MAX(id) AS id FROM users`).all() as face.User[];
    if (result[0]) return {user: result[0], success : false};
    else return null;
}
export const EmailVerify = (user: face.User, id:string): void => {
    Users.run(`INSERT INTO verify (id, user_name, user_email, user_password) VALUES ('${id}', '${user.name}', '${user.email}', '${user.password}');`)
}
export const RemoveVerify = (id: string) : void => {
    Users.run("DELETE FROM verify WHERE id = '"+ id +"';");
}

export const EmailVerifyCheck = (id: string) : object | null | unknown => {
    const result: Array<face.VerifyRecord2> = Users.query("SELECT * FROM verify WHERE id = '"+ id +"'").all(id) as face.VerifyRecord2[];
    if (result.length === 0 || result[0] === undefined) return null;
    else {
        Users.run("DELETE FROM verify WHERE id = '"+ id +"';");
        return result[0] as face.VerifyRecord2;
    }
}
export const logIn = (user: face.User): string | undefined | null => {
    const TheUser: face.User = Object(Users.query(`SELECT * FROM users WHERE name = '${user.name}' AND password = '${user.password}'`).all()[0]);
    if(!TheUser.name && Users.query(`SELECT * FROM users WHERE name = '${user.name}'`).all().length > 0)
        return null;
    Users.run(`UPDATE users SET show = TRUE WHERE id = '${TheUser.id}';`);
    const answear:any = Users.query(`SELECT id FROM session WHERE user_id = '${TheUser.id}'`).all()[0];
    if(answear.id) return answear.id;
    else return undefined;
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