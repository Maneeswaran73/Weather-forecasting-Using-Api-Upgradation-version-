let id = '9505fd1df737e20152fbd78cdb289b6a';
let url = 'https://api.openweathermap.org/data/2.5/weather?appid=' + id;
let forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?appid=' + id;

let isCelsius = true;
let currentData = null;
let currentCity = '';
let searchHistory = JSON.parse(localStorage.getItem('weatherHistory')) || [];
let favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
let isDark = localStorage.getItem('theme') === 'dark';
let currentLang = localStorage.getItem('language') || 'en';
let recognition;

const translations = {
    en: {
        title: 'Weather Forecasting',
        searchPlaceholder: 'Search for a city...',
        favorites: 'Favorites',
        addFav: 'Add to Favorites',
        hourlyForecast: 'Hourly Forecast',
        windSpeed: 'Wind Speed',
        windDirection: 'Wind Direction',
        sunrise: 'Sunrise',
        sunset: 'Sunset',
        clouds: 'clouds',
        humidity: 'humidity',
        pressure: 'pressure',
        forecast: '5-Day Forecast',
        feelsLike: 'Feels like',
        loading: 'Loading weather data...',
        alertTitle: 'Weather Alert',
        notFound: 'City not found. Please try again.',
        error: 'Error fetching weather data. Please try again.'
    },
    es: {
        title: 'Pronóstico del Tiempo',
        searchPlaceholder: 'Buscar una ciudad...',
        favorites: 'Favoritos',
        addFav: 'Añadir a Favoritos',
        hourlyForecast: 'Pronóstico por Hora',
        windSpeed: 'Velocidad del Viento',
        windDirection: 'Dirección del Viento',
        sunrise: 'Amanecer',
        sunset: 'Atardecer',
        clouds: 'nubes',
        humidity: 'humedad',
        pressure: 'presión',
        forecast: 'Pronóstico de 5 Días',
        feelsLike: 'Sensación térmica',
        loading: 'Cargando datos del clima...',
        alertTitle: 'Alerta Meteorológica',
        notFound: 'Ciudad no encontrada. Inténtalo de nuevo.',
        error: 'Error al obtener datos del clima. Inténtalo de nuevo.'
    },
    fr: {
        title: 'Prévisions Météo',
        searchPlaceholder: 'Rechercher une ville...',
        favorites: 'Favoris',
        addFav: 'Ajouter aux Favoris',
        hourlyForecast: 'Prévisions Horaires',
        windSpeed: 'Vitesse du Vent',
        windDirection: 'Direction du Vent',
        sunrise: 'Lever du Soleil',
        sunset: 'Coucher du Soleil',
        clouds: 'nuages',
        humidity: 'humidité',
        pressure: 'pression',
        forecast: 'Prévisions sur 5 Jours',
        feelsLike: 'Ressenti',
        loading: 'Chargement des données météo...',
        alertTitle: 'Alerte Météo',
        notFound: 'Ville non trouvée. Veuillez réessayer.',
        error: 'Erreur lors de la récupération des données météo.'
    },
    de: {
        title: 'Wettervorhersage',
        searchPlaceholder: 'Stadt suchen...',
        favorites: 'Favoriten',
        addFav: 'Zu Favoriten hinzufügen',
        hourlyForecast: 'Stündliche Vorhersage',
        windSpeed: 'Windgeschwindigkeit',
        windDirection: 'Windrichtung',
        sunrise: 'Sonnenaufgang',
        sunset: 'Sonnenuntergang',
        clouds: 'wolken',
        humidity: 'luftfeuchtigkeit',
        pressure: 'druck',
        forecast: '5-Tage-Vorhersage',
        feelsLike: 'Gefühlt',
        loading: 'Wetterdaten werden geladen...',
        alertTitle: 'Wetterwarnung',
        notFound: 'Stadt nicht gefunden. Bitte versuchen Sie es erneut.',
        error: 'Fehler beim Abrufen der Wetterdaten.'
    },
    hi: {
        title: 'मौसम पूर्वानुमान',
        searchPlaceholder: 'शहर खोजें...',
        favorites: 'पसंदीदा',
        addFav: 'पसंदीदा में जोड़ें',
        hourlyForecast: 'प्रति घंटा पूर्वानुमान',
        windSpeed: 'हवा की गति',
        windDirection: 'हवा की दिशा',
        sunrise: 'सूर्योदय',
        sunset: 'सूर्यास्त',
        clouds: 'बादल',
        humidity: 'आर्द्रता',
        pressure: 'दबाव',
        forecast: '5-दिन का पूर्वानुमान',
        feelsLike: 'महसूस होता है',
        loading: 'मौसम डेटा लोड हो रहा है...',
        alertTitle: 'मौसम चेतावनी',
        notFound: 'शहर नहीं मिला। कृपया पुनः प्रयास करें।',
        error: 'मौसम डेटा प्राप्त करने में त्रुटि।'
    },
    zh: {
        title: '天气预报',
        searchPlaceholder: '搜索城市...',
        favorites: '收藏',
        addFav: '添加到收藏',
        hourlyForecast: '每小时预报',
        windSpeed: '风速',
        windDirection: '风向',
        sunrise: '日出',
        sunset: '日落',
        clouds: '云量',
        humidity: '湿度',
        pressure: '气压',
        forecast: '5天预报',
        feelsLike: '体感温度',
        loading: '正在加载天气数据...',
        alertTitle: '天气警报',
        notFound: '未找到城市。请重试。',
        error: '获取天气数据时出错。'
    }
};

// DOM Elements
let city = document.querySelector('.name');
let form = document.querySelector("form");
let temperature = document.querySelector('.temperature');
let description = document.querySelector('.description');
let valueSearch = document.getElementById('name');
let clouds = document.getElementById('clouds');
let humidity = document.getElementById('humidity');
let pressure = document.getElementById('pressure');
let main = document.querySelector('main');
let feelsLike = document.getElementById('feelsLike');
let windSpeed = document.getElementById('windSpeed');
let windDirection = document.getElementById('windDirection');
let sunrise = document.getElementById('sunrise');
let sunset = document.getElementById('sunset');
let forecastContainer = document.getElementById('forecastContainer');
let hourlyContainer = document.getElementById('hourlyContainer');
let unitToggle = document.getElementById('unitToggle');
let themeToggle = document.getElementById('themeToggle');
let locationBtn = document.getElementById('locationBtn');
let voiceBtn = document.getElementById('voiceBtn');
let langSelector = document.getElementById('langSelector');
let errorMessage = document.getElementById('errorMessage');
let loading = document.getElementById('loading');
let resultSection = document.getElementById('resultSection');
let searchHistoryDiv = document.getElementById('searchHistory');
let addFavoriteBtn = document.getElementById('addFavoriteBtn');
let favoritesList = document.getElementById('favoritesList');
let weatherAlert = document.getElementById('weatherAlert');
let rainEffect = document.getElementById('rainEffect');
let snowEffect = document.getElementById('snowEffect');

// Initialize language
langSelector.value = currentLang;
updateLanguage();

// Initialize theme
if (isDark) {
    document.body.classList.remove('light');
    document.body.classList.add('dark');
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

// Voice recognition setup
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        voiceBtn.classList.add('listening');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        valueSearch.value = transcript;
        searchWeather(transcript);
    };

    recognition.onend = () => {
        voiceBtn.classList.remove('listening');
    };

    recognition.onerror = () => {
        voiceBtn.classList.remove('listening');
    };
} else {
    voiceBtn.style.display = 'none';
}

voiceBtn.addEventListener('click', () => {
    if (recognition) {
        recognition.lang = currentLang;
        recognition.start();
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();  
    if(valueSearch.value.trim() !== ''){
        searchWeather(valueSearch.value);
    }
});

unitToggle.addEventListener('click', () => {
    isCelsius = !isCelsius;
    unitToggle.textContent = isCelsius ? '°F' : '°C';
    if(currentData) {
        updateTemperatureDisplay(currentData);
    }
});

themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    if (isDark) {
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
});

locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        locationBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                searchWeatherByCoords(lat, lon);
            },
            (error) => {
                locationBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i>';
                showError(translations[currentLang].error);
            }
        );
    } else {
        showError('Geolocation is not supported by your browser.');
    }
});

langSelector.addEventListener('change', (e) => {
    currentLang = e.target.value;
    localStorage.setItem('language', currentLang);
    updateLanguage();
});

addFavoriteBtn.addEventListener('click', () => {
    if (currentCity && !favorites.includes(currentCity)) {
        favorites.push(currentCity);
        localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
        renderFavorites();
    }
});

function updateLanguage() {
    const t = translations[currentLang];
    document.getElementById('appTitle').textContent = t.title;
    valueSearch.placeholder = t.searchPlaceholder;
    document.getElementById('favLabel').textContent = t.favorites;
    document.getElementById('addFavText').textContent = t.addFav;
    document.getElementById('hourlyTitle').textContent = t.hourlyForecast;
    document.getElementById('windLabel').textContent = t.windSpeed;
    document.getElementById('dirLabel').textContent = t.windDirection;
    document.getElementById('sunriseLabel').textContent = t.sunrise;
    document.getElementById('sunsetLabel').textContent = t.sunset;
    document.getElementById('cloudsLabel').textContent = t.clouds;
    document.getElementById('humidityLabel').textContent = t.humidity;
    document.getElementById('pressureLabel').textContent = t.pressure;
    document.getElementById('forecastTitle').textContent = t.forecast;
    document.getElementById('feelsLikeLabel').textContent = t.feelsLike;
    document.getElementById('loadingText').textContent = t.loading;
    document.getElementById('alertTitle').textContent = t.alertTitle;
}

function createWeatherAnimation(weatherType) {
    // Remove existing animations
    rainEffect.classList.remove('active');
    snowEffect.classList.remove('active');
    rainEffect.innerHTML = '';
    snowEffect.innerHTML = '';

    // Remove weather classes
    document.body.className = document.body.className.replace(/weather-\w+/g, '');
   
    if (isDark) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.add('light');
    }

    if (weatherType.includes('rain') || weatherType.includes('drizzle')) {
        document.body.classList.add('weather-rain');
        for (let i = 0; i < 50; i++) {
            const drop = document.createElement('div');
            drop.className = 'raindrop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
            drop.style.animationDelay = Math.random() * 2 + 's';
            rainEffect.appendChild(drop);
        }
        rainEffect.classList.add('active');
    } else if (weatherType.includes('snow')) {
        document.body.classList.add('weather-snow');
        for (let i = 0; i < 30; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            flake.style.left = Math.random() * 100 + '%';
            flake.style.animationDuration = (Math.random() * 3 + 2) + 's';
            flake.style.animationDelay = Math.random() * 5 + 's';
            flake.style.width = flake.style.height = (Math.random() * 5 + 5) + 'px';
            snowEffect.appendChild(flake);
        }
        snowEffect.classList.add('active');
    } else if (weatherType.includes('clear')) {
        document.body.classList.add('weather-clear');
    } else if (weatherType.includes('cloud')) {
        document.body.classList.add('weather-clouds');
    } else if (weatherType.includes('thunderstorm')) {
        document.body.classList.add('weather-thunderstorm');
    }
}

function checkWeatherAlerts(data) {
    const temp = data.main.temp;
    const weatherType = data.weather[0].main.toLowerCase();
   
    let alertMsg = '';
   
    if (temp > 35) {
        alertMsg = '🌡️ Extreme heat warning! Stay hydrated and avoid prolonged sun exposure.';
    } else if (temp < 0) {
        alertMsg = '❄️ Freezing temperatures! Dress warmly and be cautious of ice.';
    } else if (weatherType.includes('thunderstorm')) {
        alertMsg = '⚡ Thunderstorm alert! Stay indoors and avoid outdoor activities.';
    } else if (data.wind.speed > 15) {
        alertMsg = '💨 Strong wind advisory! Secure loose objects and be cautious.';
    }
   
    if (alertMsg) {
        document.getElementById('alertMessage').textContent = alertMsg;
        weatherAlert.classList.add('show');
    } else {
        weatherAlert.classList.remove('show');
    }
}

const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
};

const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const convertTemp = (temp) => {
    return isCelsius ? temp : (temp * 9/5) + 32;
};

const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    main.classList.add('error');
    setTimeout(() => {
        errorMessage.classList.remove('show');
        main.classList.remove('error');
    }, 3000);
};

const updateTemperatureDisplay = (data) => {
    const temp = convertTemp(data.main.temp);
    const feels = convertTemp(data.main.feels_like);
    const unit = isCelsius ? '°C' : '°F';
   
    temperature.querySelector('span').innerText = Math.round(temp);
    temperature.querySelector('figcaption').innerHTML = `<span>${Math.round(temp)}</span><sup>°</sup>${isCelsius ? 'C' : 'F'}`;
    feelsLike.parentElement.innerHTML = `<span id="feelsLikeLabel">${translations[currentLang].feelsLike}</span> <span id="feelsLike">${Math.round(feels)}</span>${unit}`;
};

const addToHistory = (cityName) => {
    if (!searchHistory.includes(cityName)) {
        searchHistory.unshift(cityName);
        if (searchHistory.length > 5) {
            searchHistory.pop();
        }
        localStorage.setItem('weatherHistory', JSON.stringify(searchHistory));
        renderHistory();
    }
};

const clearHistory = () => {
    searchHistory = [];
    localStorage.removeItem('weatherHistory');
    renderHistory();
};

const renderHistory = () => {
    searchHistoryDiv.innerHTML = '';
    if (searchHistory.length > 0) {
        searchHistory.forEach(city => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.textContent = city;
            item.addEventListener('click', () => {
                valueSearch.value = city;
                searchWeather(city);
            });
            searchHistoryDiv.appendChild(item);
        });
       
        const clearBtn = document.createElement('button');
        clearBtn.className = 'clear-history';
        clearBtn.innerHTML = '<i class="fa-solid fa-trash"></i> Clear';
        clearBtn.addEventListener('click', clearHistory);
        searchHistoryDiv.appendChild(clearBtn);
    }
};

const renderFavorites = () => {
    favoritesList.innerHTML = '';
    favorites.forEach(fav => {
        const item = document.createElement('div');
        item.className = 'favorite-item';
        item.innerHTML = `
            <span>${fav}</span>
            <i class="fa-solid fa-times remove-fav"></i>
        `;
        item.querySelector('span').addEventListener('click', () => {
            searchWeather(fav);
        });
        item.querySelector('.remove-fav').addEventListener('click', (e) => {
            e.stopPropagation();
            favorites = favorites.filter(f => f !== fav);
            localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
            renderFavorites();
        });
        favoritesList.appendChild(item);
    });
};

const searchWeatherByCoords = (lat, lon) => {
    loading.classList.add('show');
    resultSection.style.display = 'none';
   
    const units = isCelsius ? 'metric' : 'imperial';
   
    fetch(`${url}&lat=${lat}&lon=${lon}&units=${units}`)
        .then(response => response.json())
        .then(data => {
            locationBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i>';
            loading.classList.remove('show');
           
            if(data.cod == 200){
                processWeatherData(data);
                getForecastByCoords(lat, lon);
            } else {
                resultSection.style.display = 'block';
                showError(translations[currentLang].error);
            }
        })
        .catch(error => {
            locationBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i>';
            loading.classList.remove('show');
            resultSection.style.display = 'block';
            showError(translations[currentLang].error);
        });
};

const searchWeather = (cityName) => {
    loading.classList.add('show');
    resultSection.style.display = 'none';
   
    const units = isCelsius ? 'metric' : 'imperial';
   
    fetch(url + '&q=' + cityName + '&units=' + units)
        .then(response => response.json())
        .then(data => {
            loading.classList.remove('show');
           
            if(data.cod == 200){
                processWeatherData(data);
                getForecast(cityName);
            } else {
                resultSection.style.display = 'block';
                showError(translations[currentLang].notFound);
            }
            valueSearch.value = '';
        })
        .catch(error => {
            loading.classList.remove('show');
            resultSection.style.display = 'block';
            showError(translations[currentLang].error);
            console.error('Error:', error);
        });
};

const processWeatherData = (data) => {
    currentData = data;
    currentCity = data.name;
    resultSection.style.display = 'block';
   
    city.querySelector('figcaption').innerHTML = data.name;
    city.querySelector('img').src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;
    temperature.querySelector('img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
   
    updateTemperatureDisplay(data);
   
    description.innerText = data.weather[0].description;
    clouds.innerText = data.clouds.all;
    humidity.innerText = data.main.humidity;
    pressure.innerText = data.main.pressure;
    windSpeed.innerText = data.wind.speed.toFixed(1);
    windDirection.innerText = getWindDirection(data.wind.deg);
    sunrise.innerText = formatTime(data.sys.sunrise);
    sunset.innerText = formatTime(data.sys.sunset);
   
    createWeatherAnimation(data.weather[0].main.toLowerCase());
    checkWeatherAlerts(data);
    addToHistory(data.name);
};

const getForecast = (cityName) => {
    const units = isCelsius ? 'metric' : 'imperial';
   
    fetch(forecastUrl + '&q=' + cityName + '&units=' + units)
        .then(response => response.json())
        .then(data => {
            if(data.cod == "200"){
                displayHourlyForecast(data.list);
                displayForecast(data.list);
            }
        })
        .catch(error => console.error('Forecast error:', error));
};

const getForecastByCoords = (lat, lon) => {
    const units = isCelsius ? 'metric' : 'imperial';
   
    fetch(`${forecastUrl}&lat=${lat}&lon=${lon}&units=${units}`)
        .then(response => response.json())
        .then(data => {
            if(data.cod == "200"){
                displayHourlyForecast(data.list);
                displayForecast(data.list);
            }
        })
        .catch(error => console.error('Forecast error:', error));
};

const displayHourlyForecast = (forecastData) => {
    hourlyContainer.innerHTML = '';
    const hourlyData = forecastData.slice(0, 8);
   
    hourlyData.forEach(hour => {
        const date = new Date(hour.dt * 1000);
        const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const temp = Math.round(convertTemp(hour.main.temp));
        const unit = isCelsius ? '°C' : '°F';
       
        const item = document.createElement('div');
        item.className = 'hourly-item';
        item.innerHTML = `
            <div class="time">${time}</div>
            <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="Weather">
            <div class="temp">${temp}${unit}</div>
        `;
        hourlyContainer.appendChild(item);
    });
};

const displayForecast = (forecastData) => {
    forecastContainer.innerHTML = '';
    const dailyData = {};
   
    forecastData.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if(!dailyData[date]) {
            dailyData[date] = item;
        }
    });
   
    const days = Object.values(dailyData).slice(0, 5);
   
    days.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString(currentLang, { weekday: 'short' });
        const temp = Math.round(convertTemp(day.main.temp));
        const unit = isCelsius ? '°C' : '°F';
       
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="day">${dayName}</div>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather">
            <div class="temp">${temp}${unit}</div>
            <div style="font-size: 12px; opacity: 0.9;">${day.weather[0].description}</div>
        `;
        forecastContainer.appendChild(card);
    });
};

const initApp = () => {
    renderHistory();
    renderFavorites();
    valueSearch.value = 'Washington';
    searchWeather('Washington');
};

initApp();
