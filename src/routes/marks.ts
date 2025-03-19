import { Elysia} from "elysia";
import * as controller from "../Controllers/MarksController";
export const Marks = (app:Elysia) => {
    // creat offer
    app.post('/mark', controller.AddMark);
    // creat mark
    app.post('/acceptmark', controller.AcceptMark);
    // get marks
    app.get('/marks/:GroupName', controller.GetMarks);
    // delete mark
    app.put('/mark', controller.DeleteMark);
    // delete offers
    app.put('/offer', controller.DeleteOffer);
    // get image
    app.post('/image', controller.GetImage);
}
export default Marks;