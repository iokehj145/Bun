import * as db from "../DataBase/MarksDb";
import * as face from '../Interfaces/MarksInterface';
import lucia from "../config/lucia";
// create mark
export const AddMark = async({body}: {body: face.CreatMark}) : Promise<Response>=> {
    try {
        const { user } = await lucia.validateSession(body.SessionID)
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
}
}
// get a group of marks
export const GetMarks = async(req:any, res:any) : Promise<face.Mark[]> =>{
    return db.GetMarks(req.params.GroupName as string);
}
// delete mark
export const DeleteMark = async({body}: {body: face.DeleteMark}) : Promise<Response> => {
    const { user } = await lucia.validateSession(body.SessionID);
    if (!user) return new Response(null, { status: 400 });
    db.DeleteMark(body.MarkId);
    return new Response(null, { status: 200 });
}