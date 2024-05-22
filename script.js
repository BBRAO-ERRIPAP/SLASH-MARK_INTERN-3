document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'your_api_key'; // Replace with your actual API key
    const searchButton = document.getElementById('searchButton');
    const detectButton = document.getElementById('detectButton');

    searchButton.addEventListener('click', () => {
        const location = document.getElementById('locationInput').value;
        fetchWeatherData(location);
    });

    detectButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherDataByCoords(latitude, longitude);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });

    async function fetchWeatherData(location) {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        displayWeather(data);

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`);
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    }

    async function fetchWeatherDataByCoords(lat, lon) {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        displayWeather(data);

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    }

    function displayWeather(data) {
        const currentWeatherInfo = document.getElementById('current-weather-info');
        currentWeatherInfo.innerHTML = `
            <h3>${data.name}, ${data.sys.country}</h3>
            <p>${data.weather[0].description}</p>
            <p>Temperature: ${data.main.temp} °C</p>
            <p>Feels Like: ${data.main.feels_like} °C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
            <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
            <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
        `;
    }

    function displayForecast(data) {
        const forecastInfo = document.getElementById('forecast-info');
        forecastInfo.innerHTML = '';

        const dailyData = data.list.filter(reading => reading.dt_txt.includes("12:00:00"));
        dailyData.forEach(day => {
            forecastInfo.innerHTML += `
                <div class="forecast-day">
                    <h4>${new Date(day.dt_txt).toLocaleDateString()}</h4>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
                    <p>${day.weather[0].description}</p>
                    <p>Temperature: ${day.main.temp} °C</p>
                </div>
            `;
        });
    }
});
