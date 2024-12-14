import { Elysia} from "elysia";
import * as controller from "../Controllers/AdminController";
export const admin = (app:Elysia) => {
  // get users
  app.get("/admin/:token", controller.DownloadUsersDB)

}
export default admin;