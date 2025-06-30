const apiKey = '07c4895d180d296e163e437a2f55b175'; // Replace with your key

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');

const currentDate = document.getElementById('currentDate');
const temp = document.getElementById('temp');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const forecastGrid = document.getElementById('forecastGrid');
const toggleNight = document.getElementById('toggleNight');

async function fetchWeather(city) {
  try {
    const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    const currentData = await currentRes.json();

    if (currentData.cod !== 200) {
      alert('City not found! Please try again.');
      return;
    }

    updateCurrentUI(currentData);

    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
    const forecastData = await forecastRes.json();

    updateForecastUI(forecastData);

  } catch (error) {
    alert('Error fetching data. Check your internet or API key.');
  }
}

function updateCurrentUI(data) {
  currentDate.textContent = new Date().toDateString();
  temp.textContent = `${Math.round(data.main.temp)}°C`;
  feelsLike.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${data.wind.speed} km/h`;
  pressure.textContent = `${data.main.pressure} hPa`;
  visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;

  document.body.classList.remove('default-bg'); // Remove default background
  changeBackground(data.weather[0].main); // Set new background
}

function updateForecastUI(data) {
  forecastGrid.innerHTML = '';

  const daily = {};
  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!daily[date]) {
      daily[date] = item;
    }
  });

  const dates = Object.keys(daily).slice(0, 5);
  dates.forEach(date => {
    const weather = daily[date];
    const div = document.createElement('div');
    div.classList.add('forecast-day');
    div.innerHTML = `
      <p>${new Date(weather.dt_txt).toLocaleDateString('en-GB', { weekday: 'short' })}</p>
      <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="icon">
      <p>${Math.round(weather.main.temp_min)}° / ${Math.round(weather.main.temp_max)}°</p>
    `;
    forecastGrid.appendChild(div);
  });
}

function changeBackground(condition) {
  let url;

  switch (condition) {
    case 'Clear':
      url = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=1920&q=80'; // Sunny
      break;
    case 'Clouds':
      url = 'https://images.unsplash.com/photo-1610878180933-67f891b5d10d?fit=crop&w=1920&q=80'; // Cloudy
      break;
    case 'Rain':
      url = 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?fit=crop&w=1920&q=80'; // Rainy
      break;
    case 'Snow':
      url = 'https://images.unsplash.com/photo-1608889175657-294b69ecf3a5?fit=crop&w=1920&q=80'; // Snowy
      break;
    case 'Thunderstorm':
      url = 'https://images.unsplash.com/photo-1600267452157-4cba2c17c9aa?fit=crop&w=1920&q=80'; // Thunder
      break;
    default:
      url = 'https://images.unsplash.com/photo-1561484930-e38d0fbfbb55?fit=crop&w=1920&q=80'; // Fallback
  }

  document.body.style.backgroundImage = `url('${url}')`;
}

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

toggleNight.addEventListener('click', () => {
  document.body.classList.toggle('night');
});
