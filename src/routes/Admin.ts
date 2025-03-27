import { Elysia} from "elysia";
import * as controller from "../Controllers/AdminController";
export const admin = (app: Elysia) => {  
  return app.group("/admin", (app) =>
    app
    // Get DB file with users
    .get("/:token", controller.DownloadUsersDB) 
    // Searching in DB
    .post("/search", controller.Search)  
    // Delete user
    .delete("/delete", controller.DeleteUser) 
  );  
}
export default admin;