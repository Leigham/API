// src/types/Route.ts

import { Request, Response } from "express";

export type Route = {
  path: string; // path of the route (e.g. /api/v1)
  method: string; // HTTP method (e.g. GET, POST, PUT, DELETE)
  limit?: number; // limit the number of requests per minute
  protected?: boolean; // require a token to access the route
  limitOverride?: boolean; // allow the limit to be overridden with a token
  handler: (req: Request, res: Response) => void; // function that handles the route (e.g. (req, res) => res.send("Hello, World!"))
  description: string; // description of the route (e.g. "Returns 'Hello, World!'")
  test: boolean; // enable the test environment for the route so /api/v1/test/routename will be available with a website to test the route
  params?: { name: string; type: string; description: string }[]; // path parameters
  queryParams?: { name: string; type: string; description: string }[]; // query parameters
};
