// src/types/Route.ts

import { Request, Response } from "express";

/**
 * @module Route
 *
 * This module defines the TypeScript type for a route in the Express application.
 * It includes details about the route's path, HTTP method, handler, and additional
 * metadata for rate limiting, protection, and testing.
 *
 * @version 1.0.0
 * @since 2024-07-24
 *
 * @author [Leigham Alexander Masters]
 */

/**
 * Represents a route in the Express application.
 *
 * @typedef {Object} Route
 *
 * @property {string} path - The path of the route (e.g., `/api/v1`).
 * @property {string} method - The HTTP method for the route (e.g., `GET`, `POST`, `PUT`, `DELETE`).
 * @property {number} [limit] - The maximum number of requests allowed per minute for this route.
 * @property {boolean} [protected] - Indicates whether the route requires authentication (true if protected).
 * @property {boolean} [limitOverride] - Allows the rate limit to be overridden with a token (true if allowed).
 * @property {(req: Request, res: Response) => void} handler - The function to handle requests to this route.
 * @property {string} description - A brief description of the route (e.g., "Returns 'Hello, World!'").
 * @property {boolean} test - Indicates if the route is available in the test environment (true if enabled).
 * @property {Array<{ name: string; type: string; description: string }>} [queryParams] - Optional query parameters for the route.
 */
export type Route = {
  path: string;
  method: string;
  limit?: number;
  protected?: boolean;
  limitOverride?: boolean;
  handler: (req: Request, res: Response) => void;
  description: string;
  test: boolean;
  queryParams?: { name: string; type: string; description: string }[];
};
