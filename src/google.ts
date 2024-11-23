import { Elysia, error} from "elysia";
import * as db from "./base";
import * as face from './interface';
import { lucia } from "./Main";
import { Cookie, generateIdFromEntropySize } from "lucia";
import { OAuth2Client } from "google-auth-library";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const Google = (app:Elysia) => {
    
    app.post('/auth/google', async (request: { body: { credential: string } }) => { // request instead {body}
        try {
            const { credential } = request.body;
            if (!credential) return new Response("Missing credential", { status: 400 });
            const ticket = await googleClient.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload?.email) return new Response("Invalid Google credential", { status: 401 });
            const UserOr : face.GoogleUser = db.GetUserGoogle(payload.email);
            if (UserOr === null || UserOr.user.id === undefined) return new Response("User not found", { status: 404 });
            if (UserOr.success) {
                const session = await lucia.getUserSessions(UserOr.user.id);
                const Cook: Cookie = lucia.createSessionCookie(session[0].id);
                return new Response(JSON.stringify(Cook), { status: 200 });
            }
            else {
                const session = await lucia.createSession(UserOr.user.id, {});
                const Cook: Cookie = lucia.createSessionCookie(session.id);
                return new Response(JSON.stringify(Cook), { status: 200 });
            }
        } catch (error) {
            console.log(error);
            return new Response(String(error), { status: 500 });
        }
    });
    

};
export default Google;