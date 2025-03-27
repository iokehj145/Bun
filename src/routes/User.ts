import { Elysia, error} from "elysia";
import * as db from "../DataBase/UsersDb";
import * as controller from "../Controllers/UserController";
import * as GoogleController from "../Controllers/GoogleController";
export const User = (app:Elysia)=> {
    // Validate a session
    app.post("/", controller.ValidateSession);
    // User Registration
    app.post("/user", controller.CreatUser, {afterHandle (){
        new Promise(resolve => setTimeout(resolve, 600000))
        .then(() => db.RemoveVerify(controller.verificationToken));
      }}
    )
    // Sign up with Google
    app.post('/auth/google', GoogleController.Google);
    // Verification
    app.get("/email-verification/:token", controller.VerificationEmail)
    // User Login
    app.post("/login", controller.LogIn);
    // Switch the Boolean variable to show
    app.put("/user", controller.SwitchShow);
    // Change username
    app.post("/user/name", controller.ChangeName);
    // Change password
    app.post("/user/password", controller.ChangePassword);
    // Delete name
    app.delete("/user/delete", controller.DeleteUser);
}
export default User;