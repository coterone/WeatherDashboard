const cityEl = document.getElementById("enter-city");
const searchEl = document.getElementById("search-button");
const clearEl = document.getElementById("clear-history");
const nameEl = document.getElementById("city-name");
const currentPicEl = document.getElementById("current-pic");
const currentTempEl = document.getElementById("temperature");
const currentHumidityEl = document.getElementById("humidity");
const currentWindEl = document.getElementById("wind-speed");
const historyEl = document.getElementById("history");
const fivedayEl = document.getElementById("fiveday-header");
const todayweatherEl = document.getElementById("today-weather");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
const APIKey = "0b2bac7de75a83d23f6c55ae40424655";

function getWeather(cityName) {
  let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
  axios.get(queryURL).then((response) => {
    todayweatherEl.classList.remove("d-none");
    const currentDate = new Date(response.data.dt * 1000);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    nameEl.innerHTML = `${response.data.name} (${month}/${day}/${year})`;
    const weatherPic = response.data.weather[0].icon;
    currentPicEl.setAttribute("src",`https://openweathermap.org/img/wn/${weatherPic}@2x.png`);
    currentPicEl.setAttribute("alt", response.data.weather[0].description);
    currentTempEl.innerHTML = `Temperature: ${k2f(response.data.main.temp)} &#176F`;
    currentHumidityEl.innerHTML = `Humidity: ${response.data.main.humidity}%`;
    currentWindEl.innerHTML = `Wind Speed: ${response.data.wind.speed} MPH`;

    const cityID = response.data.id;
    const forecastQueryURL ="https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
    axios.get(forecastQueryURL).then((response) => {
      fivedayEl.classList.remove("d-none");
      const forecastEls = document.querySelectorAll(".forecast");
      for (let i = 0; i < forecastEls.length; i++) {
        forecastEls[i].innerHTML = "";
        const forecastIndex = i * 8 + 4;
        const forecastDate = new Date(
          response.data.list[forecastIndex].dt * 1000
        );
        const forecastDay = forecastDate.getDate();
        const forecastMonth = forecastDate.getMonth() + 1;
        const forecastYear = forecastDate.getFullYear();
        const forecastDateEl = document.createElement("p");
        forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
        forecastDateEl.innerHTML = `${forecastMonth}/${forecastDay}/${forecastYear}`;
        forecastEls[i].append(forecastDateEl);

        const forecastWeatherEl = document.createElement("img");
        forecastWeatherEl.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.list[forecastIndex].weather[0].icon}@2x.png`);
        forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
        forecastEls[i].append(forecastWeatherEl);

        const forecastTempEl = document.createElement("p");
        forecastTempEl.innerHTML = `Temp: ${k2f(response.data.list[forecastIndex].main.temp)}&#176F`;
        forecastEls[i].append(forecastTempEl);

        const forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.innerHTML = `Humidity: ${response.data.list[forecastIndex].main.humidity}%`;
        forecastEls[i].append(forecastHumidityEl);
      }
    });
  });
}
// converts the temp from K to F
  function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
  }
  

// Manages the search history
function manageSearchHistory(searchTerm) {
    const searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    return searchHistory;
  }
  
  // Renders the search history
  function renderSearchHistory(searchHistory) {
    historyEl.innerHTML = "";
    for (const searchTerm of searchHistory) {
      const historyItem = document.createElement("input");
      historyItem.setAttribute("type", "text");
      historyItem.setAttribute("readonly", true);
      historyItem.setAttribute("class", "form-control d-block bg-white");
      historyItem.setAttribute("value", searchTerm);
      historyItem.addEventListener("click", function () {
        getWeather(historyItem.value);
      })
      historyEl.append(historyItem);
    }
  }
  
  // Event listener for search button
searchEl.addEventListener("click", search);

// Event listener for Enter key
cityEl.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    search();
  }
});

function search() {
  const searchTerm = cityEl.value;
  getWeather(searchTerm);
  const searchHistory = manageSearchHistory(searchTerm);
  renderSearchHistory(searchHistory);
}
  
  // Event listener for clear history button
  clearEl.addEventListener("click", function () {
    localStorage.clear();
    renderSearchHistory([]);
  });
  
  // Render initial search history
  const initialSearchHistory = JSON.parse(localStorage.getItem("search")) || [];
  renderSearchHistory(initialSearchHistory);