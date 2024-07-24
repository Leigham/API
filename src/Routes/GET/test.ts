import { Request, Response } from "express";
import { Route } from "../../types/Route";

export default {
  method: "GET",
  path: "/api/v1/test",
  description: "Returns 'Hello, World!'",
  handler: (req: Request, res: Response) => {
    res.send("Hello, World!");
  },
  test: true,
} as Route;
