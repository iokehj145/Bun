import * as db from "../DataBase/MarksDb";
import * as face from '../Interfaces/MarksInterface';
import lucia from "../config/lucia";
// create mark
export const AddMark = async({body}: {body: face.CreatMark}) : Promise<Response>=> {
        const { user } = await lucia.validateSession(body.SessionID)
        if(user){
            const IsAdded: boolean = db.AddMark(body.Mark, body.img);
            return IsAdded
                ? new Response(null, { status: 200 })
                : new Response("Ця точка вже вказана!", { status: 400 });
        }
        else return new Response("Не коректна авторизація", { status: 400 });
}
// get a group of marks
export const GetMarks = async(req:any, res:any) : Promise<face.Mark[]> =>{
    return db.GetMarks(req.params.GroupName as string);
}
// delete mark
export const DeleteMark = async({body}: {body: face.DeleteMark}) : Promise<Response> => {
    const { user } = await lucia.validateSession(body.cook);
    if (!(user?.id === '-1')) return new Response(null, { status: 400 });
    db.DeleteMark(body.MarkId);
    return new Response(null, { status: 200 });
}
// delete offers
export const DeleteOffer = async({body}: {body: face.DeleteMark}) : Promise<Response> => {
    const { user } = await lucia.validateSession(body.cook);
    if (!(user?.id === '-1')) return new Response(null, { status: 400 });
    db.DeleteOffers(body.MarkId);
    return new Response(null, { status: 200 });
}
// accept mark
export const AcceptMark = async({body}: {body: face.DeleteMark}) : Promise<Response> => {
    const { user } = await lucia.validateSession(body.cook);
    if (!(user?.id === '-1')) return new Response(null, { status: 400 });
    db.ToMark(body.MarkId);
    return new Response(null, { status: 200 });
}
// get image
export const GetImage = async ({body}: {body: face.Getimage}) => {  
    const { user } = await lucia.validateSession(body.cook)
    return user
        ? new Response(JSON.stringify({ img: db.GetImage(body.Id, body.off === 1 && user.id === '-1').image }), { status: 200 })  
        : new Response(null, { status: 400 });
};