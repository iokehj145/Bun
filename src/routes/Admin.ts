import { Elysia} from "elysia";
import * as controller from "../Controllers/AdminController";
export const admin = (app: Elysia) => {  
  return app.group("/admin", (app) =>
    app
    // Get DB file with users
    .get("/:token", controller.DownloadUsersDB, 
      {
        detail: { tags: ['Admin'], description: "Download DB with users"}
    })
    // Searching in DB
    .post("/search", controller.Search, {  
      detail: {   
        tags: ['Admin'],   
        description: "Пошук у різних таблицях бази даних. УВАГА! Поточна реалізація містить вразливості до SQL-ін'єкцій через використання конкатенації рядків замість параметризованих запитів.",  
        request: {  
          body: {  
            cook: 'Сесійний токен для аутентифікації',  
            sel: 'Таблиця для пошуку: "Users", "MarkOff" або "Mark"',  
            serch: 'Необов\'язковий параметр для пошуку (пошук виконується за частковим збігом)'  
          }  
        },  
        responses: {  
          '200': {   
            description: 'Успішний пошук. Повертає масив знайдених записів відповідно до запиту.',  
            content: {  
              'application/json': {  
                schema: {  
                  oneOf: [  
                    {  
                      description: 'Результати пошуку в таблиці Users',  
                      type: 'array',  
                      items: {  
                        type: 'object',  
                        properties: {  
                          id: { type: 'string', description: 'ID користувача' },  
                          name: { type: 'string', description: 'Ім\'я користувача' },  
                          email: { type: 'string', description: 'Email користувача' }  
                        }  
                      }  
                    },  
                    {  
                      description: 'Результати пошуку в таблиці MarkOff (offers)',  
                      type: 'array',  
                      items: {  
                        type: 'object',  
                        properties: {  
                          id: { type: 'string', description: 'ID пропозиції' },  
                          name: { type: 'string', description: 'Назва' },  
                          position_x: { type: 'number', description: 'Координата X' },  
                          position_y: { type: 'number', description: 'Координата Y' },  
                          ray: { type: 'number', description: 'Радіус' },  
                          type_group: { type: 'string', description: 'Тип групи' }  
                        }  
                      }  
                    },  
                    {  
                      description: 'Результати пошуку в таблиці Mark',  
                      type: 'array',  
                      items: {  
                        type: 'object',  
                        properties: {  
                          id: { type: 'string', description: 'ID мітки' },  
                          name: { type: 'string', description: 'Назва мітки' },  
                          position_x: { type: 'number', description: 'Координата X' },  
                          position_y: { type: 'number', description: 'Координата Y' },  
                          ray: { type: 'number', description: 'Радіус' },  
                          type_group: { type: 'number', description: 'Тип групи' },  
                          image: { type: 'string', format: 'binary', description: 'Зображення (як Blob)' }  
                        }  
                      }  
                    }  
                  ]  
                }  
              }  
            }  
          },  
          '400': { description: 'Доступ заборонено (тільки адміністратор може здійснювати пошук)' }  
        }  
      }  
    })  
    // Delete user
    .delete("/delete", controller.DeleteUser, {  
      detail: {   
        tags: ['Admin'],   
        description: "Видаляє користувача та всі пов'язані з ним сесії",  
        request: {  
          body: {  
            cook: 'Сесійний токен для аутентифікації',  
            id: 'ID користувача, якого потрібно видалити'  
          }  
        },  
        responses: {  
          '200': { description: 'Користувача успішно видалено' },  
          '400': { description: 'Доступ заборонено (тільки адміністратор видаляти користувачів)' }  
        }  
      }  
    })
    // Get image
    .post("/image", controller.GetImage, {  
      detail: {   
        tags: ['Admin'],   
        description: "Отримує зображення з таблиці 'offers' або 'images'",  
        request: {  
          body: {  
            cook: 'Сесійний токен для аутентифікації',  
            Id: 'ID запису, що містить зображення',  
            off: 'Прапорець, що вказує, з якої таблиці отримати зображення (1 для "offers", 0 для "images")'  
          }  
        },  
        responses: {  
          '200': {   
            description: 'Зображення успішно отримано',  
            content: {  
              'application/json': {  
                schema: {  
                  type: 'object',  
                  properties: {  
                    img: {   
                      type: 'string',   
                      format: 'binary',  
                      description: 'Дані зображення у форматі Blob'   
                    }  
                  }  
                }  
              }  
            }  
          },  
          '400': { description: 'Доступ заборонено (тільки адміністратор може отримувати зображення)' }  
        }  
      }  
    })
  );
}
export default admin;