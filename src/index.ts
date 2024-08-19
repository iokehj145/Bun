import { Elysia, error } from "elysia";
import { cors } from "@elysiajs/cors";
import * as db from "./base";
import { Lucia, TimeSpan } from "lucia";
import type { User, Session } from "lucia";
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
.derive( async(context) : Promise<{theUser: db.User | null; session: Session | null}> => {
  const cookieHeader = context.request.headers.get("Cookie") ?? "";
  const sessionId = lucia.readSessionCookie(cookieHeader);
  if (!sessionId) {
    return { theUser: null, session: null};
  }
  const { session, user } = await lucia.validateSession(sessionId);
  if(user === null){
    return { theUser: null, session: null};
  }
  const theUser = db.GetUser(user.id) as db.User;
  return { theUser, session };
});

app.use(cors({origin: process.env.PROD === "PROD" ? /https:\/\/the-map-ukr\.netlify\.app$/ : /http:\/\/localhost:\d{4}$/, methods: ['GET', 'POST', 'PUT'], credentials: true}));
app.get("/", ({theUser, session}) : Promise<Response> => {
  if (theUser !== null && theUser !== undefined) {
    return Promise.resolve(new Response(JSON.stringify(theUser)));
  }
  return Promise.resolve(new Response("Hello world, from Yaric!", {status:400}));
})
// User login
app.post("/user", async(request: any) => {
try{
    const user : db.User = request.body;
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
app.post("/login", async(request: any) => {
try{
  const user : db.User = request.body;
  if (user.email && user.name && user.password) {
    return error(400, "Не вірно вказані дані");
  }
  const SessionID:string = String(db.logIn(user))
  if(SessionID){
    const sessionCookie = lucia.createSessionCookie(SessionID);
    return new Response(JSON.stringify(sessionCookie), {status:200});
  }
  else{
    return error(400, "Не знайденно користувача");
  }
}
catch (theError) {
  console.log(theError);
  return error(500, String(theError));
}
})
app.put("/user", async({theUser, session}) : Promise<Response> => {
  if (theUser && theUser !== undefined && session) {
    db.IsShow(session.userId);
    return new Response(null, {status:200});
  }
  else{
    return new Response(`User = ${theUser}, session = ${session}`, {status:400});
  }
})
app.get("/users", async() => {
    return db.GetUsers();
})

app.listen(8000, () => {
    console.log("Server begin")
})