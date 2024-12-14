import { Elysia, error} from "elysia";
import * as db from "../DataBase/UsersDb";
import * as controller from "../Controllers/UserController";

export const User = (app:Elysia)=> {
    // validate session
    app.post("/", controller.ValidateSession);
    // User Register
    app.post("/user", controller.CreatUser, {afterHandle (){
        new Promise(resolve => setTimeout(resolve, 600000))
        .then(() => db.RemoveVerify(controller.verificationToken));
      }}
    )
    // verification
    app.get("/email-verification/:token", controller.VerificationEmail)
    // User Login
    app.post("/login", controller.LogIn);
    // To switch boolean variable show
    app.put("/user", controller.SwitchShow);
}
export default User;