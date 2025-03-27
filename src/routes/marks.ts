import { Elysia} from "elysia";
import * as controller from "../Controllers/MarksController";
export const Marks = (app:Elysia) => {
    return app.group("/mark", (app) =>
    app
        // Create an offer
        .post('/', controller.AddOffer)
        // Create a mark
        .post('/acceptmark', controller.AcceptMark)
        // Get marks
        .get('/:GroupName', controller.GetMarks)
        // Remove mark
        .put('/', controller.DeleteMark)
        // Remove offer
        .put('/offer', controller.DeleteOffer)
        // Get image
        .post('/image', controller.GetImage)
)}
export default Marks;