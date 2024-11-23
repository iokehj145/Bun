import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import admin from "./admin";
import Main from "./Main";
import Marks from "./marks";
import GoogleAuth from "./google";
const app = new Elysia()
app.use(cors({
  origin: process.env.PROD === "PROD" ? /https:\/\/the-map-ukr\.netlify\.app$/ : /http:\/\/localhost:\d{4}$/, 
  methods: ['GET', 'POST', 'PUT']}));
// Hello world
app.get("/", () => 'Hello world, from Yaric!')
// Import route handlers
Main(app)
GoogleAuth(app)
Marks(app)
admin(app)
// Server port
app.listen(8000, () => {
    console.log("Server begin")
})