import { Elysia, t } from "elysia";
import { staticPlugin } from "@elysiajs/static";
export const admin = (app:Elysia) => {
  app.use(staticPlugin())
  app.get("/admin/:token", async({params : {token}}) => {
    if (token === process.env.AdminKey) {
        return Bun.file('public/Users.sqlite');
     }
     else { return "NO!"; }
  })
}