import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from '@elysiajs/swagger'
import { errorHandlerMiddleware } from "./middlewares/ErrorMiddleware";
import Admin from "./routes/Admin"
import Main from "./routes/User";
import Marks from "./routes/marks";
export const app = new Elysia()
// CORS
.use(swagger({path: '/docs', documentation: {
    tags:[{name:'User', description:'User routes'},
          {name:'Mark', description:'Marks routes'},
          {name:'Admin', description:'Admin routes'}],  
    info: {
      title: 'back-end server API',
      description: "Ця back-end частина створена Ярославом Тюріном ще у 2024 році для проєкту 'пошук майданчиків'.",  
      version: '1.0.0'
    }  
  }}))
.use(cors({
    origin: process.env.PROD === "PROD" ? /https:\/\/the-map-ukr\.netlify\.app$/ : /http:\/\/localhost:\d{4}$/, 
    methods: ['GET', 'POST', 'PUT', 'DELETE']}))
errorHandlerMiddleware(app)
// Hello world
app.get("/", () => "Hello world, from Yaric!")
app.get("/favicon.ico", () => null)
// Route handlers
Main(app)
Marks(app)
Admin(app)
// Server port
app.listen(8000, () => {
    console.log("Server begin")
})