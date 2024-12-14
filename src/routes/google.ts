import { Elysia } from "elysia";
import * as Controller from "../Controllers/GoogleController";
export const Google = (app:Elysia) => {
    // Regesteration via Google
    app.post('/auth/google', Controller.Google);
    

};
export default Google;