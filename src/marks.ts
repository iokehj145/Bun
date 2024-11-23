import { Elysia, error} from "elysia";
import * as db from "./base";
import * as face from './interface';
import { lucia } from "./Main";
export const Marks = (app:Elysia) => {
    // creat mark
    app.post('/mark', async({body}: {body: face.CreatMark}) : Promise<Response> => {
        try {
            const { session, user } = await lucia.validateSession(body.SessionID)
            if(user){
                const IsAdded: boolean = db.AddMark(body.Mark);
                return IsAdded
                    ? new Response(null, { status: 200 })
                    : new Response("Ця точка вже вказана!", { status: 400 });
            }
            else {
                return new Response("Не коректна авторизація", { status: 400 });
            }
        }
        catch (theError) {
        console.error(theError);
        return Promise.resolve(new Response(String(theError), {status:500}));
    }});
    // get marks
    app.get('/marks/:GroupName', async({params : {GroupName}}) : Promise<face.Mark[]> => {
        return db.GetMarks(GroupName);
    });
}
export default Marks;