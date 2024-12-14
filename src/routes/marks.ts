import { Elysia} from "elysia";
import * as controller from "../Controllers/MarksController";
export const Marks = (app:Elysia) => {
    // creat mark
    app.post('/mark', controller.AddMark);
    // get marks
    app.get('/marks/:GroupName', controller.GetMarks);
    // delete mark
    app.put('/mark', controller.DeleteMark);
}
export default Marks;