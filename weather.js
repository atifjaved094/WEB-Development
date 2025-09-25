document.getElementById('weatherForm').addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const city = document.getElementById('cityInput').value.trim();
            if (!city) {
                showError('Please enter a city name.');
                return;
            }

            hideError();
            showLoading();
            hideWeatherCard();

            try {
                // First, get coordinates for the city using Open-Meteo geocoding
                const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
                
                if (!geoResponse.ok) {
                    throw new Error('Geocoding API error');
                }
                
                const geoData = await geoResponse.json();
                
                if (!geoData.results || geoData.results.length === 0) {
                    throw new Error('City not found. Please check the spelling and try again.');
                }
                
                const { latitude, longitude, name, country } = geoData.results[0];
                
                // Then get weather data using the coordinates
                const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
                
                if (!weatherResponse.ok) {
                    throw new Error('Weather API error');
                }
                
                const weatherData = await weatherResponse.json();
                
                // Display the weather data
                displayWeatherData(name, country, weatherData);
                
                hideLoading();
                showWeatherCard();
            } catch (error) {
                hideLoading();
                showError(error.message || 'Unable to fetch weather data. Please try again later.');
                console.error('Error:', error);
            }
        });

        function displayWeatherData(city, country, data) {
            // Set city name
            document.getElementById('cityName').textContent = `${city}, ${country}`;
            
            // Set current temperature
            document.getElementById('temperature').textContent = `${data.current.temperature_2m} ${data.current_units.temperature_2m}`;
            
            // Set weather icon and description based on weather code
            const weatherCode = data.current.weather_code;
            const { icon, description } = getWeatherIcon(weatherCode);
            document.getElementById('weatherIcon').innerHTML = icon;
            document.getElementById('weatherDescription').textContent = description;
            
            // Set additional details
            document.getElementById('feelsLike').textContent = `${data.current.apparent_temperature} ${data.current_units.temperature_2m}`;
            document.getElementById('humidity').textContent = `${data.current.relative_humidity_2m} ${data.current_units.relative_humidity_2m}`;
            document.getElementById('windSpeed').textContent = `${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`;
            document.getElementById('pressure').textContent = `${data.current.surface_pressure} ${data.current_units.surface_pressure}`;
            
            // Display forecast
            const forecastContainer = document.getElementById('forecastContainer');
            forecastContainer.innerHTML = '';
            
            for (let i = 0; i < 5; i++) {
                const forecastCode = data.daily.weather_code[i];
                const forecast = getWeatherIcon(forecastCode);
                
                const date = new Date(data.daily.time[i]);
                const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                
                const forecastItem = document.createElement('div');
                forecastItem.className = 'forecast-item';
                forecastItem.innerHTML = `
                    <div class="forecast-day">${day}</div>
                    <div>${forecast.icon}</div>
                    <div class="forecast-temp">${data.daily.temperature_2m_max[i]}${data.daily_units.temperature_2m_max}</div>
                    <div>${data.daily.temperature_2m_min[i]}${data.daily_units.temperature_2m_min}</div>
                `;
                
                forecastContainer.appendChild(forecastItem);
            }
        }

        function getWeatherIcon(code) {
            // Weather code mapping based on Open-Meteo documentation
            const weatherMap = {
                0: { icon: '<i class="fas fa-sun"></i>', description: 'Clear sky' },
                1: { icon: '<i class="fas fa-sun"></i>', description: 'Mainly clear' },
                2: { icon: '<i class="fas fa-cloud-sun"></i>', description: 'Partly cloudy' },
                3: { icon: '<i class="fas fa-cloud"></i>', description: 'Overcast' },
                45: { icon: '<i class="fas fa-smog"></i>', description: 'Fog' },
                48: { icon: '<i class="fas fa-smog"></i>', description: 'Depositing rime fog' },
                51: { icon: '<i class="fas fa-cloud-rain"></i>', description: 'Light drizzle' },
                53: { icon: '<i class="fas fa-cloud-rain"></i>', description: 'Moderate drizzle' },
                55: { icon: '<i class="fas fa-cloud-rain"></i>', description: 'Dense drizzle' },
                61: { icon: '<i class="fas fa-cloud-showers-heavy"></i>', description: 'Slight rain' },
                63: { icon: '<i class="fas fa-cloud-showers-heavy"></i>', description: 'Moderate rain' },
                65: { icon: '<i class="fas fa-cloud-showers-heavy"></i>', description: 'Heavy rain' },
                71: { icon: '<i class="fas fa-snowflake"></i>', description: 'Slight snow fall' },
                73: { icon: '<i class="fas fa-snowflake"></i>', description: 'Moderate snow fall' },
                75: { icon: '<i class="fas fa-snowflake"></i>', description: 'Heavy snow fall' },
                77: { icon: '<i class="fas fa-snowflake"></i>', description: 'Snow grains' },
                80: { icon: '<i class="fas fa-cloud-showers-heavy"></i>', description: 'Slight rain showers' },
                81: { icon: '<i class="fas fa-cloud-showers-heavy"></i>', description: 'Moderate rain showers' },
                82: { icon: '<i class="fas fa-cloud-showers-heavy"></i>', description: 'Violent rain showers' },
                85: { icon: '<i class="fas fa-snowflake"></i>', description: 'Slight snow showers' },
                86: { icon: '<i class="fas fa-snowflake"></i>', description: 'Heavy snow showers' },
                95: { icon: '<i class="fas fa-bolt"></i>', description: 'Thunderstorm' },
                96: { icon: '<i class="fas fa-bolt"></i>', description: 'Thunderstorm with slight hail' },
                99: { icon: '<i class="fas fa-bolt"></i>', description: 'Thunderstorm with heavy hail' }
            };
            
            return weatherMap[code] || { icon: '<i class="fas fa-question"></i>', description: 'Unknown' };
        }

        function showError(message) {
            const errorDiv = document.getElementById('errorMessage');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }

        function hideError() {
            document.getElementById('errorMessage').style.display = 'none';
        }

        function showLoading() {
            document.getElementById('loading').style.display = 'block';
        }

        function hideLoading() {
            document.getElementById('loading').style.display = 'none';
        }

        function showWeatherCard() {
            document.getElementById('weatherCard').style.display = 'block';
        }

        function hideWeatherCard() {
            document.getElementById('weatherCard').style.display = 'none';
        }