const APIKey = "52de6d11a6cdf08cbd93228e33ff54d1";
const searchFormEl = document.getElementById('search-city-form');
const cityEl = document.getElementById('city');
const cityListEl = document.getElementById('city-list');
const weatherInfoEl = document.getElementById('weather-info');
const forecastEl = document.getElementById('forecast');

// Get weather data for a given city
function getWeatherData(city) {
  const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
  return fetch(queryURL)
    .then(function (response) {
      return response.json();
    });
}

// Get 5-day forecast data for a given city
function getForecastData(city) {
  const queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;
  return fetch(queryURL)
    .then(function (response) {
      return response.json();
    });
}

function createArticle(weatherInfo) {
  const articleEl = document.createElement('article');
  const h3El = document.createElement('h3');
  const pEl = document.createElement('p');

  h3El.textContent = weatherInfo.name + ' (' + new Date(weatherInfo.dt * 1000).toLocaleDateString() + ')';

  const iconCode = weatherInfo.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

  const iconEl = document.createElement('img');
  iconEl.src = iconUrl;
  iconEl.alt = weatherInfo.weather[0].description;
  iconEl.classList.add('weather-icon');

  pEl.innerHTML = 'Temperature: ' + weatherInfo.main.temp + '°F<br>'
    + 'Wind: ' + weatherInfo.wind.speed + ' MPH<br>'
    + 'Humidity: ' + weatherInfo.main.humidity + '%';

  articleEl.append(h3El, iconEl, pEl);

  return articleEl;
}

function createForecastCard(forecast) {
  const divEl = document.createElement('div');
  const h4El = document.createElement('h4');
  const pEl = document.createElement('p');

  divEl.classList.add('forecast-card');
  h4El.textContent = new Date(forecast.dt * 1000).toLocaleDateString();

  const iconCode = forecast.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

  const iconEl = document.createElement('img');
  iconEl.src = iconUrl;
  iconEl.alt = forecast.weather[0].description;
  iconEl.classList.add('weather-icon');

  pEl.innerHTML = 'Temperature: ' + forecast.main.temp + '°F<br>'
    + 'Wind: ' + forecast.wind.speed + ' MPH<br>'
    + 'Humidity: ' + forecast.main.humidity + '%';

  divEl.append(h4El, iconEl, pEl);

  return divEl;
}

function displayCityWeather(city) {
  getWeatherData(city)
    .then(function (data) {
      const articleEl = createArticle(data);
      weatherInfoEl.innerHTML = '';
      weatherInfoEl.appendChild(articleEl);
    });

  getForecastData(city)
    .then(function (data) {
      const dailyData = data.list.filter(function (item) {
        return item.dt_txt.includes('12:00:00');
      });

      forecastEl.innerHTML = '';

      for (const forecast of dailyData) {
        const forecastCard = createForecastCard(forecast);
        forecastEl.appendChild(forecastCard);
      }
    });
}

function loadCityList() {
  const cityList = JSON.parse(localStorage.getItem('cityList')) || [];
  cityListEl.innerHTML = '';

  for (const city of cityList) {
    const liEl = document.createElement('li');
    liEl.textContent = city;
    liEl.classList.add('city-history-item');
    cityListEl.appendChild(liEl);
  }
}

searchFormEl.addEventListener('submit', function (event) {
  event.preventDefault();

  const cityElValue = cityEl.value;

  let cityList = JSON.parse(localStorage.getItem('cityList')) || [];

  if (cityList.indexOf(cityElValue) === -1) {
    cityList.push(cityElValue);
    localStorage.setItem('cityList', JSON.stringify(cityList));
    loadCityList();
  }

  cityEl.value = '';

  displayCityWeather(cityElValue);
});

cityListEl.addEventListener('click', function (event) {
  if (event.target.matches('.city-history-item')) {
    const city = event.target.textContent;
    displayCityWeather(city);
  }
});

loadCityList();




