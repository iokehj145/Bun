import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { errorHandlerMiddleware } from "./middlewares/error.middleware";
import Admin from "./routes/Admin"
import Main from "./routes/User";
import Marks from "./routes/marks";
import GoogleAuth from "./routes/google";
export const app = new Elysia()
// CORS
app.use(cors({
    origin: process.env.PROD === "PROD" ? /https:\/\/the-map-ukr\.netlify\.app$/ : /http:\/\/localhost:\d{4}$/, 
    methods: ['GET', 'POST', 'PUT']}))
errorHandlerMiddleware(app)
// Hello world
app.get("/", () => "Hello world, from Yaric!")
// Route handlers
Main(app)
GoogleAuth(app)
Marks(app)
Admin(app)
// Server port
app.listen(8000, () => {
    console.log("Server begin")
})