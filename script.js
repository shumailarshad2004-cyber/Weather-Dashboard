const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");

const statusMessage = document.getElementById("statusMessage");
const weatherContent = document.getElementById("weatherContent");

const cityName = document.getElementById("cityName");
const weatherCondition = document.getElementById("weatherCondition");
const temperature = document.getElementById("temperature");

const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");

const forecastContainer = document.getElementById("forecastContainer");

const weatherCodes = {
    0: { text: "Clear Sky", icon: "☀️" },
    1: { text: "Mainly Clear", icon: "🌤️" },
    2: { text: "Partly Cloudy", icon: "⛅" },
    3: { text: "Overcast", icon: "☁️" },
    45: { text: "Foggy", icon: "🌫️" },
    48: { text: "Foggy", icon: "🌫️" },
    51: { text: "Light Drizzle", icon: "🌦️" },
    61: { text: "Light Rain", icon: "🌧️" },
    63: { text: "Moderate Rain", icon: "🌧️" },
    65: { text: "Heavy Rain", icon: "🌧️" },
    71: { text: "Light Snow", icon: "❄️" },
    73: { text: "Moderate Snow", icon: "🌨️" },
    80: { text: "Rain Showers", icon: "🌦️" },
    95: { text: "Thunderstorm", icon: "⛈️" }
};

weatherForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    showLoading();

    try {

        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!locationResponse.ok) {
            throw new Error("Unable to find the city.");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("City not found. Please try another city.");
        }

        const location = locationData.results[0];

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Weather data could not be loaded.");
        }

        const weatherData = await weatherResponse.json();

        displayWeather(location, weatherData);

    } catch (error) {

        showError(error.message);

    }

});

function showLoading() {

    weatherContent.classList.add("hidden");

    statusMessage.textContent = "⏳ Loading weather data...";
    statusMessage.style.color = "#2563eb";
}

function showError(message) {

    weatherContent.classList.add("hidden");

    statusMessage.textContent = `❌ ${message}`;
    statusMessage.style.color = "#dc2626";
}

function displayWeather(location, data) {

    statusMessage.textContent = "";

    weatherContent.classList.remove("hidden");

    const currentWeather = data.current;

    const currentCondition =
        weatherCodes[currentWeather.weather_code] || {
            text: "Unknown Condition",
            icon: "🌍"
        };

    cityName.textContent = `${location.name}, ${location.country}`;

    weatherCondition.textContent =
        `${currentCondition.icon} ${currentCondition.text}`;

    temperature.textContent =
        Math.round(currentWeather.temperature_2m);

    windSpeed.textContent =
        `${Math.round(currentWeather.wind_speed_10m)} km/h`;

    feelsLike.textContent =
        `${Math.round(currentWeather.apparent_temperature)}°C`;

    humidity.textContent =
        `${currentWeather.relative_humidity_2m}%`;

    displayForecast(data.daily);
}

function displayForecast(dailyData) {

    forecastContainer.innerHTML = "";

    for (let i = 0; i < 3; i++) {

        const weatherInfo =
            weatherCodes[dailyData.weather_code[i]] || {
                text: "Unknown",
                icon: "🌍"
            };

        const date = new Date(dailyData.time[i]);

        const formattedDate = date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric"
        });

        const forecastCard = document.createElement("div");

        forecastCard.className = "forecast-card";

        forecastCard.innerHTML = `
            <h3>${formattedDate}</h3>
            <div class="forecast-icon">${weatherInfo.icon}</div>
            <p>${weatherInfo.text}</p>
            <p>
                <strong>${Math.round(dailyData.temperature_2m_max[i])}°C</strong>
                /
                ${Math.round(dailyData.temperature_2m_min[i])}°C
            </p>
        `;

        forecastContainer.appendChild(forecastCard);
    }
}