import { Lucia, TimeSpan } from "lucia";
import {adapter} from "./db.config";
const lucia = new Lucia(adapter, {
    sessionExpiresIn: new TimeSpan(2, "w"),
    sessionCookie:{
      attributes: {
        secure: process.env.PROD === "PROD" ? true : false
      }
    }
});
export default lucia;