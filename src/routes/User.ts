import { Elysia, error} from "elysia";
import * as db from "../DataBase/UsersDb";
import * as controller from "../Controllers/UserController";
import * as GoogleController from "../Controllers/GoogleController";
export const User = (app:Elysia)=> {
    return app.group('/user', (app) =>
    app
      // Validate a session
      .post("/", controller.ValidateSession)
      // User Registration
      .post("/add", controller.CreatUser, {afterHandle (){
          new Promise(resolve => setTimeout(resolve, 600000))
          .then(() => db.RemoveVerify(controller.verificationToken));
        }}
      )
      // Sign up with Google
      .post('/auth/google', GoogleController.Google)
      // Verification
      .get("/email-verification/:token", controller.VerificationEmail)
      // User Login
      .post("/login", controller.LogIn)
      // Switch the Boolean variable to show
      .put("/", controller.SwitchShow)
      // Change username
      .post("/name", controller.ChangeName)
      // Change password
      .post("/password", controller.ChangePassword)
      // Delete name
      .delete("/delete", controller.DeleteUser)
      // Reset password
      .post("/reset", controller.Reset)
)}
export default User;