document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const storedCityName = localStorage.getItem("cityName");

  if (storedCityName) {
    cityInput.value = storedCityName;
    fetchWeather();
  }
  form.addEventListener("submit", fetchWeather);
});

const cityInput = document.getElementById("cityInput");
const cityName = cityInput.value.trim();

function fetchWeather(event) {
  const cityInput = document.getElementById("cityInput");
  const cityName = cityInput.value.trim();
  const apiKeyUnsplash = "9QqrXRUEAyCVA9ExcyHM-bCbx-Hg7U_2lwfcn7rEV9c";
  const apiUnsplash = `https://api.unsplash.com/search/photos?query=${cityName}&client_id=${apiKeyUnsplash}`;

  if (event) {
    event.preventDefault();
  }

  if (cityName === "") {
    displayErrorMessage("City name is required !");
    return;
  }

  const apiKey = "5067cfc4d8e6f24c95f9a6048779c6c7";
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&cnt=40&units=metric&appid=${apiKey}`;

  // Call the 1st api to get long and lat for the city
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Unable to fetch weather data.");
      }
    })
    .then((data) => {
      let lat = data[0].lat;
      let lon = data[0].lon;

      // Save the city name into the localStorage
      localStorage.setItem("cityName", cityName);

      // fetch for the 5 days api
      fetch(apiUrl.replace("{lat}", lat).replace("{lon}", lon))
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("There is an error!");
          }
          WeatherData;
        })
        .then((data) => {
          displayWeatherData(data);
          fetchCityImage(cityName);
        })
        .catch((error) => {
          displayErrorMessage(error.message);
        });
    })
    .catch((error) => {
      displayErrorMessage(error.message);
    });

  function fetchCityImage(cityName) {
    fetch(apiUnsplash)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Unable to fetch the image.");
        }
      })
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const photo = data.results[0];
          const photoCity = document.querySelector(".photo");

          photoCity.src = photo.urls.regular;
          photoCity.alt = photo.alt_description;
        } else {
          displayErrorMessage("No photo found for the city.");
        }
      })
      .catch((error) => {
        displayErrorMessage(error.message);
      });
  }
}

function displayWeatherData(data) {
  const weatherDataElement = document.getElementsByClassName("weatherData")[0];
  weatherDataElement.innerHTML = "";

  const forecastsPerDay = 8;
  const dailyForecasts = data.list.filter(
    (forecast, index) => index % forecastsPerDay === 0
  ); // Filter to get one forecast per day

  dailyForecasts.slice(0, 5).forEach((forecast) => {
    // Slice to only consider the next 5 days

    const { dt_txt, main, weather, icon } = forecast;

    const date = new Date(dt_txt).toLocaleDateString();
    const temperature = main.temp;
    const description = weather[0].description;
    const iconCode = weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

    const forecastElement = document.createElement("div");
    forecastElement.classList.add("forecast");
    const weatherDataText = document.getElementsByClassName("weatherDataText");
    const textElement = document.createElement("div");
    textElement.classList.add("text");
    const cityElement = document.createElement("p");
    cityElement.textContent = cityName;
    cityElement.classList.add("city");

    const dateElement = document.createElement("p");
    dateElement.textContent = `Date: ${date}`;
    dateElement.classList.add("date");

    const temperatureElement = document.createElement("p");
    temperatureElement.textContent = `Temperature: ${temperature}°C`;
    temperatureElement.classList.add("temperature");

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = `Description: ${description}`;
    descriptionElement.classList.add("description");
    const photoElement = document.createElement("img");
    photoElement.classList.add("photo");

    const iconElement = document.createElement("img");
    iconElement.classList.add("icon");
    iconElement.src = iconUrl;
    iconElement.alt = description;

    textElement.appendChild(cityElement);
    textElement.appendChild(dateElement);
    textElement.appendChild(temperatureElement);
    textElement.appendChild(descriptionElement);
    forecastElement.appendChild(textElement);
    forecastElement.appendChild(iconElement);
    forecastElement.appendChild(photoElement);

    weatherDataElement.appendChild(forecastElement);
  });
}

function displayErrorMessage(message) {
  const errorElement = document.getElementById("error");
  errorElement.textContent = message;
}
