import { Request, Response } from "express";
import { Route } from "../../types/Route";

// Define the handler for the POST /register endpoint
const registerHandler = (req: Request, res: Response): void => {
  const { name, email, password } = req.body;
  const { testMode } = req.query as { testMode?: string }; // Example of a query parameter

  if (!name || !email || !password) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  res.status(201).json({
    message: "User registered successfully",
    user: { name, email },
    testMode: testMode === "true" ? "Test mode enabled" : "Test mode disabled",
  });
};

// Define the route with query parameters
const registerRoute: Route = {
  path: "/api/v1/register",
  method: "POST",
  limit: 100, // Optional: limit the number of requests per minute
  protected: false, // Optional: specify if this route requires authentication
  limitOverride: false, // Optional: whether the rate limit can be overridden
  handler: registerHandler,
  description:
    "Registers a new user. Requires 'name', 'email', and 'password' in the request body. Optionally, use 'testMode' query parameter.",
  test: true,
  queryParams: [
    {
      name: "testMode",
      type: "string",
      description: "Enable test mode for the registration.",
    },
  ],
};

export default registerRoute;
