import * as face from '../Interfaces/AdminInterface';
import { Users, Marks } from "../config/db.config";
// create Admin account
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
// get Admin session
export const AdminSession = (): face.Admin =>
  Users.query("SELECT id FROM session WHERE user_id = '-1' LIMIT 1").get() as face.Admin;
// Search and Filter
export const Search = (option: string, search?: string) => {
  switch (option) {
    case "Users":
      return search
      ? Users.query(`SELECT * FROM users WHERE name LIKE '%${search}%' OR email LIKE '%${search}%'`).all()
      : Users.query(`SELECT * FROM users`).all();
    case "MarkOff":
      return search
      ? Marks.query(`SELECT * FROM offers WHERE name LIKE '%${search}%'`).all()
      : Marks.query(`SELECT * FROM offers`).all();
    case "Mark":
      return search
      ? Marks.query(`SELECT * FROM marks WHERE name LIKE '%${search}%'`).all()
      : Marks.query(`SELECT * FROM marks`).all();
  }
}