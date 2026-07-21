# Weather Dashboard

A responsive weather dashboard built using HTML, CSS, and JavaScript.

## Features

- Search weather by city
- Live weather data using Open-Meteo API
- Current temperature and weather condition
- Wind speed, humidity, and feels-like temperature
- 3-day weather forecast
- Loading state during API requests
- Friendly error handling
- Responsive design for mobile and desktop

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Fetch API
- Async/Await
- Open-Meteo API

## How It Works

The application first uses the Open-Meteo Geocoding API to find the latitude and longitude of the searched city. It then uses these coordinates to request live weather data from the Open-Meteo Forecast API. The data is dynamically rendered on the webpage using JavaScript and DOM manipulation.

## Error Handling

The application displays a loading message while API requests are in progress. If a city cannot be found or the API request fails, a friendly error message is shown to the user.

## Project Preview

This project demonstrates API integration and asynchronous JavaScript using Fetch and async/await.