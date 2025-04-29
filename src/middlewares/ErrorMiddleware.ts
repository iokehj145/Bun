import { Elysia, error as Error } from "elysia";

export const ErrorHandlerMiddleware = (app: Elysia): void => {
  app.onError(({ error }) => {
    if ('message' in error) console.log("Error caught: ", error.message);
    return Error(500,"Internal Server Error");
  });
};