import express from "express";
import https from "https";
import fs from "fs";
import path from "path";
import { RouteLoader } from "../utils/RouteLoader"; // Adjust the path to where your RouteLoader is defined

export class Server {
  private https: boolean;
  private host: string;
  private port: number;
  private routesPath: string;

  constructor(https: boolean, host: string, port: number, routesPath: string) {
    this.https = https;
    this.host = host;
    this.port = port;
    this.routesPath = routesPath;
  }

  public start(): void {
    console.log(
      `Starting server on ${this.https ? "https" : "http"}://${this.host}:${
        this.port
      }`
    );

    const app = express();

    // Load routes
    const routeLoader = new RouteLoader(this.routesPath, app);
    routeLoader.loadRoutes();

    // Start server logic
    if (this.https) {
      const options = {
        key: fs.readFileSync("path/to/key.pem"),
        cert: fs.readFileSync("path/to/cert.pem"),
      };
      https.createServer(options, app).listen(this.port, () => {
        console.log(
          `HTTPS Server started on https://${this.host}:${this.port}`
        );
      });
    } else {
      app.listen(this.port, () => {
        console.log(`HTTP Server started on http://${this.host}:${this.port}`);
      });
    }
  }
}

// Define the path to your routes
const routesPath = path.join(__dirname, "../routes"); // Adjust as necessary

// Create and start the server
const server = new Server(false, "localhost", 4000, routesPath);
server.start();
