import { Elysia, error} from "elysia";
import { cors } from "@elysiajs/cors";
import * as db from "./base";
import { Lucia, TimeSpan, generateIdFromEntropySize } from "lucia";
import dotenv from "dotenv";
dotenv.config();
const LinkTheSite:string = process.env.PROD === "PROD" ? "https://mathematical-hayley-something3-7954a83a.koyeb.app/email-verification/" : "http://localhost:8000/email-verification/";
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
app.get("/", () : Response => {
  return new Response("Hello world, from Yaric!", {status:200});
})
app.post("/", async({body}) : Promise<Response> => {
try{
  if (body) {
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
  console.error(theError);
  return Promise.resolve(new Response(String(theError), {status:500}));
} })
// User Register
app.post("/user", async({ body }: { body: db.User }) => {
try {
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
    const verificationToken: string = generateIdFromEntropySize(12)
    db.EmailVerify(user, verificationToken)
    
    const verificationLink: string = LinkTheSite + verificationToken;
    const answear: object = {
      access_key: 'fcf48490-ca9d-4eaf-8702-f4bc30bac372', name: 'elysia js server',
      email: user.email,
      message: "Натисніть на посилання для підтвердження вашої електронної пошти: "+ verificationLink
    };
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {'Content-Type': 'application/json','Accept': 'application/json'},
      body: JSON.stringify(answear)
      });
    return new Response(null, {status:200});
  }
    catch(theError){
    console.error(theError);
    if(theError instanceof TypeError){
      return error(405, "Помилка типу даних");
    }
    return error(500, String(theError));
 }
})
app.get("/email-verification/:token",async({params : {token}}) : Promise<Response> => {
  const result: db.VerifyRecord2 | null = db.EmailVerifyCheck(token) as db.VerifyRecord2 | null;
   if(result === null) {
      return new Response("Не має такого токену", {status:404})
   }
   else{
      const user: db.User = {name : result.user_name, email: result.user_email, password: result.user_password};
      const userId:string= db.AddUser(user);
      await lucia.createSession(userId, {});
      return new Response("Поверніться та увійдіть на сайт", {status:200})
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
  if (typeof test === "string") {
    const SessionID:string = String(test)
    const sessionCookie = lucia.createSessionCookie(SessionID)
    return new Response(JSON.stringify(sessionCookie), {status:200})
  }
  else if (test === null) {
    return error(400, "Пароль не вірний");
  }
  else{
    return error(400, "Такого користувача не має")
  }
}
catch (theError) {
  console.error(theError);
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