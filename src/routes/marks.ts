import { Elysia} from "elysia";
import * as controller from "../Controllers/MarksController";

export const Marks = (app:Elysia) => {
    return app.group("/mark", (app) =>
    app
        // Create an offer
        .post('/', controller.AddOffer, {
          detail: { 
            tags: ['Mark'], 
            description: "Додає нову пропозицію мітки, якщо мітка з такою позицією ще не існує",
            request: {
              body: {
                SessionID: 'Сесійний токен для аутентифікації',
                Mark: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', description: 'Назва мітки' },
                    position: { 
                      type: 'array', 
                      description: 'Координати мітки [X, Y]',
                      items: { type: 'number' },
                      minItems: 2,
                      maxItems: 2
                    },
                    type_group: { type: 'string', description: 'Тип групи' },
                    ray: { type: 'number', description: 'Радіус/група мітки' }
                  }
                },
                img: 'Дані зображення у форматі base64 string'
              }
            },
            responses: {
              '200': { description: 'Пропозицію мітки успішно додано' },
              '400': { 
                description: 'Помилка додавання мітки: або мітка вже існує на цій позиції, або проблема з аутентифікацією',
                content: {
                  'text/plain': {
                    schema: {
                      type: 'string',
                      example: 'Ця точка вже вказана!' 
                    }
                  }
                }
              }
            }
          }
        })
        
        // Create a mark (accept offer)
        .post('/acceptmark', controller.AcceptMark, {
          detail: { 
            tags: ['Mark'], 
            description: "Переносить запис з таблиці 'offers' до таблиць 'marks' та 'images' (тільки для адміністратора)",
            request: {
              body: {
                cook: 'Сесійний токен для аутентифікації',
                MarkId: 'ID пропозиції мітки для прийняття'
              }
            },
            responses: {
              '200': { description: 'Пропозицію мітки успішно прийнято та перенесено до основних міток' },
              '400': { description: 'Доступ заборонено (тільки адміністратор з id="-1" може приймати пропозиції)' }
            }
          }
        })
        
        // Get marks by group
        .get('/:GroupName', controller.GetMarks, {
          detail: { 
            tags: ['Mark'], 
            description: "Отримує всі мітки, що належать до вказаної групи/радіуса",
            params: {
              GroupName: 'Назва групи або значення радіуса для фільтрації міток'
            },
            responses: {
              '200': { 
                description: 'Масив міток, що належать до вказаної групи',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', description: 'ID мітки' },
                          name: { type: 'string', description: 'Назва мітки' },
                          position_x: { type: 'number', description: 'Координата X' },
                          position_y: { type: 'number', description: 'Координата Y' },
                          type_group: { type: 'string', description: 'Тип групи' },
                          ray: { type: 'number', description: 'Радіус/група мітки' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        })
        
        // Remove mark - використовується PUT замість DELETE
        .put('/', controller.DeleteMark, {
          detail: { 
            tags: ['Mark'], 
            description: "Видаляє мітку та пов'язане з нею зображення за ID (тільки для адміністратора)",
            request: {
              body: {
                cook: 'Сесійний токен для аутентифікації',
                MarkId: 'ID мітки для видалення'
              }
            },
            responses: {
              '200': { description: 'Мітку успішно видалено' },
              '400': { description: 'Доступ заборонено (тільки адміністратор з id="-1" може видаляти мітки)' }
            }
          }
        })
        
        // Remove offer - використовується PUT замість DELETE
        .put('/offer', controller.DeleteOffer, {
          detail: { 
            tags: ['Mark'], 
            description: "Видаляє пропозицію мітки за ID (тільки для адміністратора)",
            request: {
              body: {
                cook: 'Сесійний токен для аутентифікації',
                MarkId: 'ID пропозиції мітки для видалення'
              }
            },
            responses: {
              '200': { description: 'Пропозицію мітки успішно видалено' },
              '400': { description: 'Доступ заборонено (тільки адміністратор з id="-1" може видаляти пропозиції)' }
            }
          }
        })
        
        // Get image
        .post('/image', controller.GetImage, {
          detail: { 
            tags: ['Mark'], 
            description: "Отримує зображення мітки за ID",
            request: {
              body: {
                Id: 'ID запису, що містить зображення'
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
              }
            }
          }
        })
    )
}

export default Marks;