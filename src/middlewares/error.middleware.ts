import { Elysia, error as Error } from "elysia";

export const errorHandlerMiddleware = (app: Elysia): void => {
  app.onError(({ error }) => {
    console.log("Error caught: ", error.message);

    return Error(500,"Internal Server Error");
  });
};