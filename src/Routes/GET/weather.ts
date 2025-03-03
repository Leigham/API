import { Request, Response } from "express";
import { Route } from "../../types/Route";
const apiKey = "cce3a30779e743c6b9735405242407";
// Handler function for fetching weather
const fetchWeatherHandler: (req: Request, res: Response) => void = async (
  req,
  res
) => {
  try {
    const city = req.query.city as string;

    if (!city) {
      res.status(400).json({ error: "City is required" });
      return;
    }

    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      res.json(data);
    } else {
      res.status(response.status).json({ error: data.message });
    }
  } catch (error) {
    console.error("Error fetching weather:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Define your test route
const weatherRoute: Route = {
  path: "/api/v1/weather",
  method: "GET",
  handler: fetchWeatherHandler,
  description:
    "Fetches current weather data for a specific city from OpenWeatherMap API.",
  test: true,
  queryParams: [
    {
      name: "city",
      type: "string",
      description: "The name of the city to fetch weather data for.",
    },
  ],
};

export default weatherRoute;
