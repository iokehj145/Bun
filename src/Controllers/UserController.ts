import { error } from "elysia";
import {AdminSession} from './AdminController';
import * as db from "../DataBase/UsersDb";
import * as face from '../Interfaces/UserInterface';
import {generateIdFromEntropySize } from "lucia";
import lucia from "../config/lucia";
import FormData from "form-data";
import Mailgun from "mailgun.js";
const LinkTheSite:string = process.env.PROD === "PROD" 
? "https://mathematical-hayley-something3-7954a83a.koyeb.app/user/email-verification/"
: "http://localhost:8000/user/email-verification/";
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.EmailKey || "",
});
// Validate session
export const ValidateSession = async({ body }: { body : string }) : Promise<Response> => {
        const sessionid:string = body;
        if (!sessionid ) return new Response(null, { status: 400 });
        const { user } = await lucia.validateSession(String(sessionid));
        if (!user) return new Response("User not found!", { status: 400 });

        const userData = db.GetUser(user.id) as face.User;
        return new Response(userData.name, { status: 200 });
};
// Register in verify
export let verificationToken: string = "";
export const CreatUser = async({body}: {body: face.User2}) => {
    const user : face.User2 = body;
    if(!user.name.trim()) return error(405, "Потрібно вказати Ім'я користувача")
    else if (!user.email?.endsWith("@gmail.com")) return error(405, "Не має електроної адреси!")
    const check: face.Checker = db.check(user)
    switch (check) {
      case 1: return error(409, "Користувач з таким Ім'ям вже існує")
      case 2: return error(409, "Користувач з такою електронною поштою вже існує")
      case 3: return error(409, "Користувач з таким Ім'ям вже отримав повідомлення")
      case 4: return error(409, "Користувач з такою електронною поштою вже отримав повідомлення")
    }
    verificationToken = generateIdFromEntropySize(12)
    db.EmailVerify(user, verificationToken)
    const verificationLink = LinkTheSite + verificationToken;
    // Email send
    await mg.messages.create(process.env.DOMAIN as string, {
      from: `<postmaster@${process.env.DOMAIN}>`,
      to: ["<" + user.email + ">"],
      subject: "Підтвердження електроної пошти",
      text: `Вітаємо! Щоб підтвердити вашу електронну адресу, будь ласка, натисніть на посилання: ${verificationLink}`,
    });
    return new Response(null, {status:200});
};
// Verification
export const VerificationEmail = async(req: {params : {token: string}}) : Promise<Response> => {
  const result = db.EmailVerifyCheck(req.params.token) as face.VerifyRecord2 | null;     
  if(result === null) return new Response("Посилання не коректне", {status:404})
  else {
    const user: face.User = {name : result.user_name, email: result.user_email, password: result.user_password};
    const userId:string= db.AddUser(user)
    await lucia.createSession(userId, {})
    return new Response("Поверніться та увійдіть в акаунт на сайті", {status:200})
  }
}
// Login
export const LogIn = async({body}: {body: face.User}) => {
  const { name, password } = body;
  if (!name || !password)
    return error(400, "Не вірно вказані дані");
  else if (name==='Admin' && password === process.env.AdminKey)
    return AdminSession();
  const test = db.logIn(body)
  if (typeof test === "string") {
    const sessionCookie = lucia.createSessionCookie(test)
    return new Response(JSON.stringify(sessionCookie), {status:200})
  }
  const errorMessage = test === null
    ? "Пароль не вірний"
    : "Такого користувача не має";
  return error(400, errorMessage);
}
// To switch boolean variable show
export const SwitchShow = async({body}: {body: string}) : Promise<Response> => {
  if (typeof body === "string") {
    const { session, user } = await lucia.validateSession(body);
    if (!user) return new Response("User not found!", {status : 404});
    db.IsShow(session.userId);
    return new Response((db.GetUser(user.id) as face.User).name, {status:200});
  }
  else return new Response(null, {status : 400});
}
// change username
export const ChangeName = async({body}: {body: string}) => {
  const bodyData = JSON.parse(body)
  const {cook, name} = bodyData
  const { user } = await lucia.validateSession(cook)
  if (!user) return new Response(null, {status : 404})
  else {
    const result = db.ChangeName(user.id, name)
    if (result) return new Response(null, {status:200})
    else return new Response(null, {status:400})
  }
}
// Delete user
export const DeleteUser = async({body}: {body: string}) => {
  const { user } = await lucia.validateSession(body)
  if (!user) return new Response(null, {status : 404})
  else {
    db.DeleteUser(user.id)
    return new Response(null, {status:200})
  }
}
export const ChangePassword = async({body}: {body: face.ChangePassword}) => {
  const {user} = await lucia.validateSession(body.cook)
  if (!user) return new Response(null, {status : 404})
  else {
    db.ChangePassword(user.id, body.password)
    return new Response(null, {status:200})
  }
}
// Reset user
export const Reset = async({body}: {body: {email:string}}) => {
  const User = db.GetUserByEmail(body.email)
  if (!User) return new Response(null, {status:404})
  await mg.messages.create(process.env.DOMAIN as string, {
    from: `<postmaster@${process.env.DOMAIN}>`,
    to: ["<" + User.email + ">"],
    subject: "Дані для входу у систему",
    text: `Облікові дані для входу у систему: логін: ${User.name}, пароль: ${User.password}`,
  });
  return new Response(null, {status:200})
}