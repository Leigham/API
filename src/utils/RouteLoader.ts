import fs from "fs";
import path from "path";
import express, { RequestHandler, Request, Response } from "express";
import { Route } from "../types/Route"; // Adjust the path as necessary

/**
 * RouteLoader class handles loading and registering routes dynamically from the specified directory.
 * It also provides a method to list all registered routes with their details.
 *
 * @class
 * @version 1.0.0
 * @since 2024-07-24
 * @author [Leigham Alexander Masters]
 */
export class RouteLoader {
  private routesPath: string;
  private app: express.Express;
  private routes: Route[] = []; // Initialize as an empty array

  /**
   * Creates an instance of RouteLoader.
   *
   * @param {string} routesPath - The path to the directory containing route files.
   * @param {express.Express} app - The Express application instance.
   */
  constructor(routesPath: string, app: express.Express) {
    this.routesPath = routesPath;
    this.app = app;
  }

  /**
   * Loads routes from the specified directory and registers them with the Express application.
   * Also adds a route to list all registered routes.
   */
  public loadRoutes(): void {
    const methods = ["GET", "POST", "PUT", "DELETE"];
    methods.forEach((method) => {
      const methodPath = path.join(this.routesPath, method);
      if (fs.existsSync(methodPath) && fs.statSync(methodPath).isDirectory()) {
        this.loadRoutesFromDirectory(methodPath, method);
      }
    });

    // Add the route to list all routes
    this.app.get("/", this.listRoutes.bind(this)); // Ensure correct context with bind
  }

  /**
   * Loads routes from the specified directory and registers them with the provided HTTP method.
   *
   * @param {string} directoryPath - The path to the directory containing route files.
   * @param {string} method - The HTTP method (GET, POST, PUT, DELETE) for the routes.
   */
  private loadRoutesFromDirectory(directoryPath: string, method: string): void {
    const files = fs.readdirSync(directoryPath);

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      if (fs.statSync(filePath).isFile() && file.endsWith(".ts")) {
        const routeModule = require(filePath) as { default: Route };
        this.registerRoute(routeModule.default, method);
      }
    });
  }

  /**
   * Registers a route with the Express application.
   *
   * @param {Route} route - The route object to register.
   * @param {string} method - The HTTP method (GET, POST, PUT, DELETE) for the route.
   */
  private registerRoute(route: Route, method: string): void {
    if (route.test) {
      console.log(`Registering route: ${method.toLowerCase()} ${route.path}`); // Debugging log
      this.app[method.toLowerCase() as "get" | "post" | "put" | "delete"](
        route.path,
        route.handler as RequestHandler
      );
      this.routes.push(route); // Add route to the list
      console.log(`Registered route: ${method} ${route.path}`);
    }
  }

  /**
   * Constructs a full example URL for a given route.
   *
   * @param {Route} route - The route object to construct the URL for.
   * @returns {string} - The full example URL.
   */
  private constructExampleUrl(route: Route): string {
    let url = `http://localhost:4000${route.path}`; // Adjust base URL as necessary

    // Replace path parameters with example values
    if (route.params) {
      route.params.forEach((param) => {
        const placeholder = `{${param.name}}`;
        url = url.replace(
          placeholder,
          encodeURIComponent(this.getExample(param))
        );
      });
    }

    // Append query parameters if any
    if (route.queryParams) {
      const queryString = route.queryParams
        .map(
          (param) =>
            `${param.name}=${encodeURIComponent(this.getExample(param))}`
        )
        .join("&");
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return url;
  }

  /**
   * Constructs a full example URL for a route with a specific parameter replaced by an example value.
   *
   * @param {Route} route - The route object to construct the URL for.
   * @param {Object} param - The parameter object with example details.
   * @param {string} param.name - The name of the parameter.
   * @param {string} param.type - The type of the parameter.
   * @param {string} param.description - The description of the parameter.
   * @returns {string} - The full example URL with the parameter value replaced.
   */
  private constructParamExampleUrl(
    route: Route,
    param: { name: string; type: string; description: string }
  ): string {
    let url = `http://localhost:4000${route.path}`; // Adjust base URL as necessary

    // Replace path parameters with example values
    if (route.params) {
      route.params.forEach((p) => {
        const placeholder = `{${p.name}}`;
        if (p.name === param.name) {
          url = url.replace(
            placeholder,
            encodeURIComponent(this.getExample(param))
          );
        } else {
          url = url.replace(
            placeholder,
            encodeURIComponent(this.getExample(p))
          );
        }
      });
    }

    // Append query parameters if any
    if (route.queryParams) {
      const queryString = route.queryParams
        .map((p) => {
          if (p.name === param.name) {
            return `${p.name}=${encodeURIComponent(this.getExample(param))}`;
          } else {
            return `${p.name}=${encodeURIComponent(this.getExample(p))}`;
          }
        })
        .join("&");
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return url;
  }

  /**
   * Provides example values based on the parameter type.
   *
   * @param {Object} param - The parameter object.
   * @param {string} param.type - The type of the parameter.
   * @param {string} param.name - The name of the parameter.
   * @returns {string} - An example value based on the parameter type.
   */
  private getExample(param: { type: string; name: string }): string {
    // Provide example values based on parameter type
    switch (param.type.toLowerCase()) {
      case "string":
        return `example_${param.name}`;
      case "number":
        return "123";
      case "boolean":
        return "true";
      default:
        return "example_value";
    }
  }

  /**
   * Generates an HTML page listing all registered routes with their details.
   *
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   */
  private listRoutes(req: Request, res: Response): void {
    const routeGroups: { [key: string]: Route[] } = {};

    this.routes.forEach((route) => {
      if (!routeGroups[route.method]) {
        routeGroups[route.method] = [];
      }
      routeGroups[route.method].push(route);
    });

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Documentation</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .dropdown-menu {
      display: none;
    }
    .dropdown-menu.show {
      display: block;
    }
  </style>
</head>
<body class="bg-gray-100 text-gray-900">
  <div class="container mx-auto p-6">
    <h1 class="text-4xl font-extrabold mb-6 text-center text-gray-800">API Documentation</h1>
    <div class="space-y-6">
      ${Object.keys(routeGroups)
        .map(
          (method) => `
        <div class="mb-6">
          <button class="dropdown bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" data-target="${method}">
            ${method.toUpperCase()} Routes
          </button>
          <div class="dropdown-menu bg-white shadow-lg rounded-lg p-4 mt-2" id="${method}-menu">
            ${routeGroups[method]
              .map(
                (route) => `
              <div class="mb-6 border border-gray-200 p-4 rounded-lg">
                <h2 class="text-2xl font-semibold mb-2 text-gray-700">${
                  route.path
                }</h2>
                <p class="mb-2"><strong class="text-gray-800">Description:</strong> ${
                  route.description
                }</p>
                <p class="mb-2"><strong class="text-gray-800">Full Example URL:</strong> <a href="${this.constructExampleUrl(
                  route
                )}" class="text-blue-500 hover:underline" target="_blank">${this.constructExampleUrl(
                  route
                )}</a></p>
                ${
                  route.params
                    ? `
                  <p class="mb-2"><strong class="text-gray-800">Parameters:</strong></p>
                  <ul class="list-disc pl-5">
                    ${route.params
                      .map(
                        (param) => `
                      <li class="mb-4 text-gray-600">
                        <strong class="text-gray-800">${param.name}</strong> (${
                          param.type
                        }): ${param.description}
                        <div class="mt-2">
                          <strong class="text-gray-800">Example Value:</strong>
                          <pre class="bg-gray-100 p-2 rounded"><code>${this.getExample(
                            param
                          )}</code></pre>
                          <strong class="text-gray-800">Full Example URL:</strong>
                          <pre class="bg-gray-100 p-2 rounded"><code>${this.constructParamExampleUrl(
                            route,
                            param
                          )}</code></pre>
                        </div>
                      </li>
                    `
                      )
                      .join("")}
                  </ul>
                `
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const buttons = document.querySelectorAll('.dropdown');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          const targetId = button.getAttribute('data-target');
          const menu = document.getElementById(targetId + '-menu');
          if (menu) {
            menu.classList.toggle('show');
          }
        });
      });
    });
  </script>
</body>
</html>
    `;

    res.send(html);
  }
}
