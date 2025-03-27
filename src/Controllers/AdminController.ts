import * as db from "../DataBase/AdminDb";
import lucia from "../config/lucia";
import * as face from '../Interfaces/AdminInterface';
// Download db
export const DownloadUsersDB = async(req:any, res:any) => {
    const {token} = req.params;
    if (process.env.AdminKey && token === process.env.AdminKey)
         return Bun.file('public/Users.sqlite');
    else return "NO!";
}
// Login admin
export const AdminSession = async() => {
    const check = db.AdminSession()
    if (check) {
        const SessionCookie = lucia.createSessionCookie(check.id)
        return JSON.stringify(SessionCookie);
    } 
    const Admin = db.CreateAdmin()
    const session: face.Admin = await lucia.createSession(Admin, {id: process.env.AdminKey});
    const SessionCookie = lucia.createSessionCookie(process.env.AdminKey as string)
    return JSON.stringify(SessionCookie);
}
// search
export const Search = async(body: {body:face.SearchBody}) => {
    const {cook, sel, serch} = body.body
    const { user } = await lucia.validateSession(cook)
    if (user?.id === '-1')
        return serch ? db.Search(sel, serch) : db.Search(sel)
    else return new Response(undefined, {status: 400})
}
// Delete user
export const DeleteUser = async(body: {body:face.DeleteUser}) => {
    const {cook, id} = body.body
    const { user } = await lucia.validateSession(cook)
    if (user?.id === '-1')
        return db.DeleteUser(id)
    else return new Response(undefined, {status: 400})
}