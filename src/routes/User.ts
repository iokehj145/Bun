import { Elysia } from "elysia";  
import * as db from "../DataBase/UsersDb";  
import * as controller from "../Controllers/UserController";  
import * as GoogleController from "../Controllers/GoogleController";  

export const User = (app:Elysia)=> {  
    return app.group('/user', (app) =>  
    app  
      // Validate a session  
      .post("/", controller.ValidateSession, {  
        detail: {   
          tags: ['User'],   
          description: "Перевірити дійсність сесійного токена та отримати ім'я користувача",  
          request: {  
            body: {  
              content: {  
                'text/plain': {  
                  schema: { type: 'string', description: 'Сесійний токен' }  
                }  
              }  
            }  
          },  
          responses: {  
            '200': {   
              description: 'Сесія дійсна, повертає ім\'я користувача',  
              content: {  
                'text/plain': {  
                  schema: { type: 'string', example: 'Ім\'я користувача' }  
                }  
              }  
            },  
            '400': {   
              description: 'Невірний токен або користувача не знайдено',  
              content: {  
                'text/plain': {  
                  schema: { type: 'string', example: 'User not found!' }  
                }  
              }  
            }  
          }  
        }  
      })  
      
      // User Registration  
      .post("/add", controller.CreatUser, {  
        detail: {   
          tags: ['User'],   
          description: "Реєстрація нового користувача з надсиланням листа для підтвердження електронної адреси",  
          request: {  
            body: {  
              name: 'Ім\'я користувача',  
              password: 'Пароль',  
              email: 'Електронна пошта (тільки Gmail)'  
            }  
          },  
          responses: {  
            '200': { description: 'Запит на реєстрацію прийнято, на пошту відправлено лист з підтвердженням' },  
            '405': {   
              description: 'Помилка валідації даних',  
              content: {  
                'application/json': {  
                  schema: {   
                    type: 'object',  
                    properties: {  
                      message: { type: 'string', example: 'Потрібно вказати Ім\'я користувача' }  
                    }  
                  }  
                }  
              }  
            },  
            '409': {   
              description: 'Конфлікт даних - користувач або email вже існує',  
              content: {  
                'application/json': {  
                  schema: {   
                    type: 'object',  
                    properties: {  
                      message: { type: 'string', example: 'Користувач з таким Ім\'ям вже існує' }  
                    }  
                  }  
                }  
              }  
            }  
          }  
        },  
        afterHandle (){  
          new Promise(resolve => setTimeout(resolve, 600000))  
          .then(() => db.RemoveVerify(controller.verificationToken));  
        }}  
      )  
      
      // Sign up with Google  
      .post('/auth/google', GoogleController.Google, {  
        detail: {   
          tags: ['User'],   
          description: "Авторизація за допомогою Google OAuth",  
          request: {  
            body: {  
              credential: 'JWT токен аутентифікації Google'  
            }  
          },  
          responses: {  
            '200': {   
              description: 'Успішна авторизація, повертає сесійний токен',  
              content: {  
                'application/json': {  
                  schema: {   
                    type: 'object',  
                    properties: {  
                      name: { type: 'string', description: 'Назва cookie' },  
                      value: { type: 'string', description: 'Значення cookie' },  
                      attributes: {   
                        type: 'object',  
                        properties: {  
                          httpOnly: { type: 'boolean' },  
                          secure: { type: 'boolean' },  
                          path: { type: 'string' }  
                        }  
                      }  
                    }  
                  }  
                }  
              }  
            },  
            '400': { description: 'Помилка авторизації через Google' }  
          }  
        }  
      })  
      
      // Verification  
      .get("/email-verification/:token", controller.VerificationEmail, {  
        detail: {   
          tags: ['User'],   
          description: "Підтвердження електронної адреси за посиланням з листа",  
          params: {  
            token: 'Унікальний токен підтвердження'  
          },  
          responses: {  
            '200': {   
              description: 'Електронна адреса підтверджена, користувач створений',  
              content: {  
                'text/plain': {  
                  schema: { type: 'string', example: 'Поверніться та увійдіть в акаунт на сайті' }  
                }  
              }  
            },  
            '404': {   
              description: 'Токен недійсний або прострочений',  
              content: {  
                'text/plain': {  
                  schema: { type: 'string', example: 'Посилання не коректне' }  
                }  
              }  
            }  
          }  
        }  
      })  
      
      // User Login  
      .post("/login", controller.LogIn, {  
        detail: {   
          tags: ['User'],   
          description: "Вхід користувача в систему",  
          request: {  
            body: {  
              name: 'Ім\'я користувача',  
              password: 'Пароль'  
            }  
          },  
          responses: {  
            '200': {   
              description: 'Успішний вхід, повертає сесійний токен',  
              content: {  
                'application/json': {  
                  schema: {   
                    type: 'object',  
                    properties: {  
                      name: { type: 'string', description: 'Назва cookie' },  
                      value: { type: 'string', description: 'Значення cookie' },  
                      attributes: {   
                        type: 'object',  
                        properties: {  
                          httpOnly: { type: 'boolean' },  
                          secure: { type: 'boolean' },  
                          path: { type: 'string' }  
                        }  
                      }  
                    }  
                  }  
                }  
              }  
            },  
            '400': {   
              description: 'Помилка входу',  
              content: {  
                'application/json': {  
                  schema: {   
                    type: 'object',  
                    properties: {  
                      message: { type: 'string', example: 'Пароль не вірний' }  
                    }  
                  }  
                }  
              }  
            }  
          }  
        }  
      })  
      
      // Switch the Boolean variable to show  
      .put("/", controller.SwitchShow, {  
        detail: {   
          tags: ['User'],   
          description: "Перемикає стан видимості користувача",  
          request: {  
            body: {  
              content: {  
                'text/plain': {  
                  schema: { type: 'string', description: 'Сесійний токен' }  
                }  
              }  
            }  
          },  
          responses: {  
            '200': {   
              description: 'Стан видимості змінено, повертає ім\'я користувача',  
              content: {  
                'text/plain': {  
                  schema: { type: 'string', example: 'Ім\'я користувача' }  
                }  
              }  
            },  
            '400': { description: 'Невірний формат запиту' },  
            '404': {   
              description: 'Користувача не знайдено',  
              content: {  
                'text/plain': {  
                  schema: { type: 'string', example: 'User not found!' }  
                }  
              }  
            }  
          }  
        }  
      })  
      
      // Change username  
      .post("/name", controller.ChangeName, {  
        detail: {   
          tags: ['User'],   
          description: "Змінює ім'я користувача",  
          request: {  
            body: {  
              cook: 'Сесійний токен',  
              name: 'Нове ім\'я користувача'  
            }  
          },  
          responses: {  
            '200': { description: 'Ім\'я користувача успішно змінено' },  
            '400': { description: 'Помилка при зміні імені (можливо, таке ім\'я вже існує)' },  
            '404': { description: 'Користувача не знайдено' }  
          }  
        }  
      })  
      
      // Change password  
      .post("/password", controller.ChangePassword, {  
        detail: {   
          tags: ['User'],   
          description: "Змінює пароль користувача",  
          request: {  
            body: {  
              cook: 'Сесійний токен',  
              password: 'Новий пароль'  
            }  
          },  
          responses: {  
            '200': { description: 'Пароль успішно змінено' },  
            '404': { description: 'Користувача не знайдено' }  
          }  
        }  
      })  
      
      // Delete name  
      .delete("/delete", controller.DeleteUser, {  
        detail: {   
          tags: ['User'],   
          description: "Видаляє обліковий запис користувача",  
          request: {  
            body: {  
              content: {  
                'text/plain': {  
                  schema: { type: 'string', description: 'Сесійний токен' }  
                }  
              }  
            }  
          },  
          responses: {  
            '200': { description: 'Користувача успішно видалено' },  
            '404': { description: 'Користувача не знайдено' }  
          }  
        }  
      })  
      
      // Reset password  
      .post("/reset", controller.Reset, {  
        detail: {   
          tags: ['User'],   
          description: "Надсилає дані для входу на електронну пошту користувача",  
          request: {  
            body: {  
              email: 'Електронна пошта користувача'  
            }  
          },  
          responses: {  
            '200': { description: 'Дані для входу надіслано на вказану електронну пошту' },  
            '404': { description: 'Користувача з такою електронною адресою не знайдено' }  
          }  
        }  
      })  
    )  
}  

export default User;