import { Elysia, error} from "elysia";
import { cors } from "@elysiajs/cors";
import * as db from "./base";
import { Lucia, TimeSpan } from "lucia";
import dotenv from "dotenv";
dotenv.config();
var count:number = 1;
const lucia = new Lucia(db.adapter, {
  sessionExpiresIn: new TimeSpan(2, "w"),
  sessionCookie: {
    attributes: {
      secure: process.env.PROD === "PROD" ? true : false
    }
  }
})
const app = new Elysia()

app.use(cors({origin: process.env.PROD === "PROD" ? /https:\/\/the-map-ukr\.netlify\.app$/ : /http:\/\/localhost:\d{4}$/, methods: ['GET', 'POST', 'PUT'], credentials: true}));
app.get("/", () => {
  return new Response("Hello world, from Yaric!", {status:200});
})
app.post("/", async({body}) : Promise<Response> => {
try{ if (body) {
     const { session, user } = await lucia.validateSession(String(body));
     if (!user){
       return Promise.resolve(new Response("User not found!", {status:400}));
     }
     const theUser = db.GetUser(user.id) as db.User;
     return Promise.resolve(new Response(JSON.stringify(theUser), { status: 200 }));
  }
  return Promise.resolve(new Response(null, {status:400}));
}
catch (theError) {
  console.log(theError);
  return Promise.resolve(new Response(String(theError), {status:500}));
}
})
// User Register
app.post("/user", async({ body }: { body: db.User }) => {
try{
    const user : db.User = body;
    if( !user.name || user.name.trim() === ""){
      return error(405, "Потрібно вказати Ім'я користувача");
    }
    else if(!user.email.endsWith("@gmail.com")){
      return error(405, "Не має електроної адреси!")
    }
    const check: db.Checker = db.check(user);
    if(check === 1){
      return error(409, "Користувач з таким Ім'ям вже існує");
    }
    else if(check === 2){
      return error(409, "Користувач з такою електронною поштою вже існує");
    }
    const userId:string = count.toString();
    db.AddUser(user, userId);
    count++;
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    return new Response(JSON.stringify(sessionCookie), {status:200});
  }
    catch(theError){
    console.log(theError);
    if(theError instanceof TypeError){
      return error(405, "Помилка типу даних");
    }
    return error(500, String(theError));
 }
})
// User Login
app.post("/login", async(request: any) => {
try{
  const user : db.User = request.body;
  if (user.email && user.name && user.password) {
    return error(400, "Не вірно вказані дані");
  }
  const test:any = db.logIn(user)
  if(typeof test === "string"){
    const SessionID:string = String(test)
    const sessionCookie = lucia.createSessionCookie(SessionID)
    return new Response(JSON.stringify(sessionCookie), {status:200})
  }
  else{
    return error(400, "Такого користувача не має")
  }
}
catch (theError) {
  console.log(theError);
  return error(500, String(theError));
}
})

app.put("/user", async({ body }) : Promise<Response> => {
  if (typeof body === "string") {
    const { session, user } = await lucia.validateSession(String(body));
    if (!user){
      return new Response("User not found!", {status : 404});
    }
    db.IsShow(session.userId);
    return new Response(JSON.stringify(db.GetUser(user.id) as db.User), {status:200});
  }
  else{
    return new Response(null, {status : 400});
  }
})
app.get("/users", async() => {
    return db.GetUsers();
})

app.listen(8000, () => {
    console.log("Server begin")
})