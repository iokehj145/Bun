import * as face from '../Interfaces/UserInterface';
import { Users } from "../config/db.config";
/**  
 * Checks if a user or their email already exists in the database  
 *   
 * Return codes:  
 * 1 - Username already exists in users table  
 * 2 - Email already exists in users table  
 * 3 - Username already exists in verify table  
 * 4 - Email already exists in verify table  
 * null - No conflicts found  
 *   
 * @param user - User object containing name and optional email  
 * @returns A code indicating any conflicts, or null if none  
 */
export const check = (user: face.User) : face.Checker => {
    const NameQuery = Users.prepare("SELECT 1 FROM users WHERE name = ?");
    const EmailQuery = Users.prepare("SELECT 1 FROM users WHERE email = ?");
    const VerifyNameQuery = Users.prepare("SELECT 1 FROM verify WHERE user_name = ?");
    const VerifyEmailQuery = Users.prepare("SELECT 1 FROM verify WHERE user_email = ?");
    if (NameQuery.all(user.name).length > 0)
         return 1;
    else if (user.email && EmailQuery.all(user.email).length > 0)
         return 2;
    else if (VerifyNameQuery.all(user.name).length > 0)
         return 3;
    else if (user.email && VerifyEmailQuery.all(user.email).length > 0)
         return 4;
    else return null;
};
/**  
 * Adds a new user to the database  
 *   
 * SECURITY ISSUE: This function is vulnerable to SQL injection attacks  
 * due to direct string concatenation in the SQL query.  
 *   
 * @param user - User object containing name, password, and email  
 * @returns The ID of the newly created user, or empty string on failure  
 */
export const AddUser = (user: face.User) : string => {
    Users.run(`INSERT INTO users (id, name, password, email) VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM users),'${user.name}', '${user.password}', '${user.email}');`);
    console.log(`Add user ${user.name}, email ${user.email}, password ${user.password}`)
    const result:any = Users.query(`SELECT MAX(id) AS id FROM users`).all();
    if  (typeof result[0].id === "string")
         return result[0].id;
    else return "";
};
/**  
 * Gets or creates a user for Google authentication  
 *   
 * This function:  
 * 1. Tries to find a user with the given email
 * 2. If found, updates their status to visible (show=TRUE) and returns the user  
 * 3. If not found, creates a new user with the email and returns them  
 *   
 * @param email - The Google email address to find or create a user for  
 * @returns User information with success status, or null on error  
 */ 
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
/**  
 * Creates a verification entry for a user  
 * @param user - The user object containing name, email, and password  
 * @param id - The verification ID to associate with this user  
 */
export const EmailVerify = (user: face.User2, id:string) =>{
    const query = Users.prepare(`  
        INSERT INTO verify (id, user_name, user_email, user_password)   
        VALUES (?, ?, ?, ?)
    `);
    query.run(id, user.name, user.email, user.password)
}
/**  
 * Removes a verification entry by ID  
 * @param id - The verification ID to remove  
 */
export const RemoveVerify = (id: string) : void => {
    Users.run("DELETE FROM verify WHERE id = '"+ id +"';");
}
/**  
 * Creates a verification entry for a user  
 *   
 * @param user - The user object containing name, email, and password  
 * @param id - The verification ID to associate with this user  
 */ 
export const EmailVerifyCheck = (id: string) : face.VerifyRecord2 | null | unknown => {
    const QuerySelect = Users.prepare(`SELECT * FROM verify WHERE id = ?`);
    const QueryRun = Users.prepare(`DELETE FROM verify WHERE id = ?`);
    const result = QuerySelect.all(id) as face.VerifyRecord2[];
    if (result.length === 0 || result[0] === undefined) return null;
    else {
        QueryRun.run(id)
        return result[0] as face.VerifyRecord2;
    }
}
/**
* User Authentication
*
* @param user - User object containing a username and password
* @returns
* - Session ID if authentication is successful and a session exists
* - undefined if authentication is successful, but no session exists
* - null if the password is incorrect
*/
export const logIn = (user: face.User): string | undefined | null => {
    const UsersQuery = Users.prepare(`SELECT * FROM users WHERE name = ? AND password = ?`)
    const TheUser: face.User = Object(UsersQuery.all(user.name, user.password)[0]);
    const checkQuery = Users.prepare(`SELECT * FROM users WHERE name = ?`)
    if(!TheUser.name && checkQuery.all(user.name).length > 0)
        return null;
    Users.run(`UPDATE users SET show = TRUE WHERE id = '${TheUser.id}';`);
    const answear:any = Users.query(`SELECT id FROM session WHERE user_id = '${TheUser.id}'`).all()[0];
    if(answear?.id) return answear.id;
    else return undefined;
}
/**  
 * Changes the user's name  
 *   
 * @param ID - User's ID  
 * @param name - New name  
 * @returns true if the name was successfully changed, false if the name is already taken  
 */
export const ChangeName = (ID: string, name: string) : boolean => {
    const Select = Users.prepare("SELECT * FROM users WHERE name = ?")
    const QueryRun = Users.prepare("UPDATE users SET name = ? WHERE id = ?")
    if (Select.all(name).length > 0)
        return false;
    else {
        QueryRun.run(name, ID)
        return true;
}}
/**
* Retrieves user information by ID
*
* @param ID - User ID
* @returns An object containing user information
*/
export const GetUser = (ID: string) => {
    return Users.query(`SELECT * FROM users WHERE id = '${ID}'`).get();
};
/**  
 * Toggles the user's visibility status  
 *   
 * @param ID - User ID  
 */
export const IsShow = (ID: string) => {
    return Users.run(`UPDATE users SET show = NOT show WHERE id = '${ID}';`);
};
/**  
 * Deletes a user and their sessions from the database  
 *  
 * @param ID - User ID  
 */
export const DeleteUser = (ID: string): void => {
    Users.run(`DELETE FROM users WHERE id = '${ID}';
               DELETE FROM session WHERE user_id = '${ID}'`);
};
/**  
 * Changes the user's password  
 *   
 * @param ID - User ID  
 * @param password - New password  
 */
export const ChangePassword = (ID: string, password: string) : void => {
    Users.run(`UPDATE users SET password = '${password}' WHERE id = '${ID}';`);
}
/**  
 * Retrieves a user from database by email  
 *   
 * @param {string} Email - User's email address  
 * @returns {face.User2 | null} User object or null if not found/invalid  
 */
export const GetUserByEmail = (Email: string): face.User2 | null => {
    const Query = Users.prepare(`SELECT * FROM users WHERE email = ?`)
    const User = Query.get(Email) as face.User2 | null;
    if (User?.password) return User;
    else return null;
}