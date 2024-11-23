import { Elysia, t } from "elysia";
export const admin = (app:Elysia) => {

  app.get("/admin/:token", async({params : {token}}) => {
    if (token === process.env.AdminKey) {
        return Bun.file('public/Users.sqlite');
     }
     else { return "NO!"; }
  })

}
export default admin;