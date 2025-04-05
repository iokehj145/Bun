import * as face from '../Interfaces/AdminInterface';
import { Users, Marks } from "../config/db.config";
/**
 * Create Admin account
 * @returns Admin ID
*/
export const CreateAdmin = (): string => {
  const Admin = Users.query(`SELECT * FROM users WHERE name = 'Admin'`).all()[0] as face.Admin | null | undefined;
  if (Admin && Admin.id) return Admin.id;
  else {
        Users.run(`INSERT INTO users (id, name, password, email) VALUES ('-1','Admin', '${process.env.AdminKey}', NULL);`);
        console.log('Add Admin')
        const Admin2 = Users.query(`SELECT * FROM users WHERE name = 'Admin'`).all()[0] as face.Admin;
        return Admin2.id;
  }
}
/**
 * Get Admin session
 * @returns Admin session
 */
export const AdminSession = (): face.Admin =>{
  return Users.query("SELECT id FROM session WHERE user_id = '-1' LIMIT 1").get() as face.Admin;
}
/**  
 * Search function for querying different database tables  
 * WARNING! Current implementation contains serious SQL injection vulnerabilities  
 * because it uses string concatenation instead of parameterized queries.
 *   
 * @param option - Specifies the table to search: "Users", "MarkOff" or "Mark"  
 * @param search - Optional search parameter (search is performed by partial match)  
 * @returns Array of found records according to the query  
 */
export const Search = (option: string, search?: string): face.UserRecord[] | face.OfferRecord[] | face.MarkRecord[] | unknown => {
  switch (option) {
    case "Users":
      return search
      ? Users.query(`SELECT * FROM users WHERE name LIKE '%${search}%' OR email LIKE '%${search}%'`).all()
      : Users.query(`SELECT * FROM users`).all();
    case "MarkOff":
      return search
      ? Marks.query(`SELECT id, name, position_x, position_y, ray, type_group FROM offers WHERE name LIKE '%${search}%'`).all()
      : Marks.query(`SELECT id, name, position_x, position_y, ray, type_group FROM offers`).all();
    case "Mark":
      return search
      ? Marks.query(`SELECT * FROM marks WHERE name LIKE '%${search}%'`).all()
      : Marks.query(`SELECT * FROM marks`).all();
  }
}
/** Delete user
 * @param id - The ID of the user to delete
*/
export const DeleteUser = (id: string) : void => {
  Users.run(`DELETE FROM users WHERE id = '${id}';
             DELETE FROM session WHERE user_id = '${id}'`);
}