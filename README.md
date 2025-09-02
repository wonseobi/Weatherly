# https://api.openweathermap.org/data/2.5/weather?q=Monterrey,mx&appid=5b549a8a3d848027af3b29231469a8fb&units=metric

# API Call JSON Answer
{
    "coord": {
        "lon": -100.3167,
        "lat": 25.6667
    },
    "weather": [
        {
            "id": 800,
            "main": "Clear",
            "description": "clear sky",
            "icon": "01d"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 32.37,
        "feels_like": 34.55,
        "temp_min": 32.37, // 
        "temp_max": 32.95,
        "pressure": 1016,
        "humidity": 48,
        "sea_level": 1016,
        "grnd_level": 919
    },
    "visibility": 10000,
    "wind": {
        "speed": 2.41,
        "deg": 54,
        "gust": 1.53
    },
    "clouds": {
        "all": 10
    },
    "dt": 1756409201,
    "sys": {
        "type": 1,
        "id": 7108,
        "country": "MX",
        "sunrise": 1756383620,
        "sunset": 1756429496
    },
    "timezone": -21600,
    "id": 3995465,
    "name": "Monterrey",
    "cod": 200
}