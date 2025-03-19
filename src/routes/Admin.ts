import { Elysia} from "elysia";
import * as controller from "../Controllers/AdminController";
export const admin = (app:Elysia) => {
  // get users
  app.get("/admin/:token", controller.DownloadUsersDB)
  // search
  app.post("/admin/search", controller.Search);
}
export default admin;