import { Route } from "../../types/Route";

export default {
  path: "/api/v1/test2",
  method: "GET",
  description: "Returns 'Hello, World!'",
  handler: (req, res) => {
    res.send("Hello, World!");
  },
  test: true,
  queryParams: [
    {
      name: "city",
      type: "string",
      description: "The name of the city to fetch weather data for.",
    },
  ],
} as Route;
