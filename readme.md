# Express Server with Dynamic Route Loading

This repository provides a template for an Express server that dynamically loads routes from a specified directory. The server can be configured to run with either HTTP or HTTPS, and it includes functionality for generating API documentation.

## Features

- **Dynamic Route Loading**: Automatically loads routes from a specified directory.
- **HTTP/HTTPS Support**: Configurable to run as either HTTP or HTTPS server.
- **API Documentation**: Provides an auto-generated documentation page listing all registered routes with examples.

## Getting Started

### Prerequisites

- Node.js (version 14.x or later recommended)
- npm (or yarn)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/express-server.git
   cd express-server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Generate SSL Certificates (for HTTPS):**

   If you plan to use HTTPS, you will need SSL certificates. You can generate self-signed certificates for development purposes using tools like `openssl`.

   Example command to generate a self-signed certificate:

   ```bash
   openssl req -nodes -new -x509 -keyout key.pem -out cert.pem
   ```

   Place the generated `key.pem` and `cert.pem` in the appropriate directory (update paths in `Server` class).

### Configuration

Update the `Server` class configuration to suit your needs:

- **HTTPS Configuration**: Set `https` to `true` and provide paths to your SSL certificate files.
- **Host and Port**: Adjust `host` and `port` as necessary.
- **Routes Path**: Set `routesPath` to the directory containing your route files.

### Usage

1. **Define your routes:**

   Create route files in the `routes` directory. Ensure each file exports a route object that conforms to the `Route` type.

2. **Start the Server:**

   Update `routesPath` in `src/server.ts` to point to your routes directory and run:

   ```bash
   npm start
   ```

   The server will start and listen on the configured host and port. If running with HTTPS, ensure that you have valid SSL certificates.

### Example

Here's a basic example of a route file (`routes/getHello.ts`):

```typescript
import { RequestHandler } from "express";

const handler: RequestHandler = (req, res) => {
  res.json({ message: "Hello, world!" });
};

export default {
  path: "/hello",
  method: "GET",
  handler,
  description: "Returns a hello world message",
};
```
