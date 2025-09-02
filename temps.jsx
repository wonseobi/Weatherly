import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Switch,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { 
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons
} from '@expo/vector-icons';

import { styles, lightTheme, darkTheme } from './src/styles/AppStyles';
const { width } = Dimensions.get('window');

// OpenWeatherMap API configuration
const API_KEY = '5b549a8a3d848027af3b29231469a8fb';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/onecall';

// Location coordinates for different countries/cities
const LOCATION_COORDINATES = {
  'Mexico': { lat: 19.4326, lon: -99.1332, name: 'Mexico City' },
  'South Korea': { lat: 37.5665, lon: 126.9780, name: 'Seoul' },
  'United States': { lat: 40.7128, lon: -74.0060, name: 'New York' },
  'Japan': { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
  'China': { lat: 39.9042, lon: 116.4074, name: 'Beijing' },
  'United Kingdom': { lat: 51.5074, lon: -0.1278, name: 'London' },
  'Canada': { lat: 45.4215, lon: -75.6972, name: 'Ottawa' },
  'Australia': { lat: -33.8688, lon: 151.2093, name: 'Sydney' },
};

const WeatherApp = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [locationDropdownVisible, setLocationDropdownVisible] = useState(false);
  const [temperatureDropdownVisible, setTemperatureDropdownVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Current Location');
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius');
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isColorblindMode, setIsColorblindMode] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [currentLocationName, setCurrentLocationName] = useState('');
  const [locationPermission, setLocationPermission] = useState(null);
  
  // Weather data state
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  
  const theme = isDarkTheme ? darkTheme : lightTheme;

  // Convert temperature based on selected unit
  const convertTemperature = (temp) => {
    if (temperatureUnit === 'Fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
  };

  // Get weather icon emoji based on weather condition
  const getWeatherIcon = (weatherMain, weatherIcon) => {
    const iconMap = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️',
    };
    return iconMap[weatherMain] || '🌤️';
  };

  // Format weather status
  const formatWeatherStatus = (description) => {
    return description.toUpperCase();
  };

  // Get air quality description
  const getAirQualityDescription = (aqi) => {
    const descriptions = {
      1: 'Good',
      2: 'Fair',
      3: 'Moderate',
      4: 'Poor',
      5: 'Very Poor'
    };
    return descriptions[aqi] || 'Unknown';
  };

  // Get UV Index description
  const getUVDescription = (uvi) => {
    if (uvi <= 2) return 'Low';
    if (uvi <= 5) return 'Moderate';
    if (uvi <= 7) return 'High';
    if (uvi <= 10) return 'Very High';
    return 'Extreme';
  };

  // Fetch weather data from OpenWeatherMap API
  const fetchWeatherData = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await fetch(
      `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&exclude=minutely,alerts`
      );

      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      setWeatherData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      Alert.alert('Error', 'Failed to fetch weather data. Please try again.');
      setLoading(false);
    }
  };

  // Get current location coordinates
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please grant location permissions to use current location feature.',
          [{ text: 'OK' }]
        );
        return null;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      setCurrentCoordinates({ lat: latitude, lon: longitude });

      // Get location name from coordinates
      const [placeDetails] = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      if (placeDetails) {
        const locationName = placeDetails.city || placeDetails.region || placeDetails.country || 'Current Location';
        setCurrentLocationName(locationName);
        
        // Fetch weather data for current location
        await fetchWeatherData(latitude, longitude);
        
        return locationName;
      }
      return 'Current Location';
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not get current location');
      return null;
    }
  };

  // Handle location change
  const handleLocationChange = async (location) => {
    setSelectedLocation(location);
    
    if (location === 'Current Location') {
      if (currentCoordinates) {
        await fetchWeatherData(currentCoordinates.lat, currentCoordinates.lon);
      } else {
        await getCurrentLocation();
      }
    } else {
      const coordinates = LOCATION_COORDINATES[location];
      if (coordinates) {
        await fetchWeatherData(coordinates.lat, coordinates.lon);
      }
    }
  };

  const formatDateTime = (date) => {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const day = days[date.getDay()];
    const dateNum = date.getDate();
    
    // Handle suffix logic properly
    let suffix;
    if (dateNum >= 11 && dateNum <= 13) {
      suffix = 'TH';
    } else {
      switch (dateNum % 10) {
        case 1:
          suffix = 'st';
          break;
        case 2:
          suffix = 'nd';
          break;
        case 3:
          suffix = 'rd';
          break;
        default:
          suffix = 'th';
      }
    }
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${day} ${dateNum}${suffix} ${formattedHours}:${formattedMinutes}${ampm}`;
  };

  // Format time from Unix timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const [slideAnim] = useState(new Animated.Value(width * 0.8));
  const [overlayAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const [slideUpAnim] = useState(new Animated.Value(20));

  const countries = ['Current Location', 'Mexico', 'South Korea', 'United States', 'Japan', 'China', 'United Kingdom', 'Canada', 'Australia'];

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    // Get initial location and weather data
    getCurrentLocation();

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, []);

  // Update weather data when temperature unit changes
  useEffect(() => {
    // Weather data doesn't need to be refetched when unit changes,
    // just the display will update automatically
  }, [temperatureUnit]);

  const toggleMenu = () => {
    if (menuVisible) {
      // Hide menu
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: width * 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setMenuVisible(false));
    } else {
      // Show menu
      setMenuVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 22) return 'Good Evening';
    return 'Good Night';
  };

  const MenuIcon = () => (
    <View style={styles.menuIcon}>
      <View style={styles.dot} />
      <View style={styles.dot} />
      <View style={styles.dot} />
    </View>
  );

  const SunIcon = () => (
    <Text style={styles.emojiIcon}>☀️</Text>
  );

  const MoonIcon = () => (
    <Text style={styles.emojiIcon}>🌙</Text>
  );

  // Display location name
  const getDisplayLocationName = () => {
    if (selectedLocation === 'Current Location') {
      return currentLocationName || 'Getting location...';
    }
    return LOCATION_COORDINATES[selectedLocation]?.name || selectedLocation;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#FF9F1D', '#826E7D', '#35375C', '#000000']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Animated.View style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideUpAnim }
            ]
          }
        ]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.locationLabel}>
                {getDisplayLocationName()}
              </Text>
              <Text style={styles.greeting}>{getTimeBasedGreeting()}</Text>
            </View>
            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
              <MenuIcon />
            </TouchableOpacity>
          </View>

          {/* Loading Indicator */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>Loading weather data...</Text>
            </View>
          ) : (
            <>
              {/* Weather Icon */}
              <View style={styles.weatherIconContainer}>
                <Text style={styles.weatherIconPlaceholder}>
                  {weatherData ? getWeatherIcon(weatherData.current.weather[0].main) : '🌤️'}
                </Text>
              </View>

              {/* Temperature */}
              <Text style={styles.temperature}>
                {weatherData ? `${convertTemperature(weatherData.current.temp)}°${temperatureUnit === 'Celsius' ? 'C' : 'F'}` : '24°C'}
              </Text>
              
              {/* Weather Status */}
              <Text style={styles.weatherStatus}>
                {weatherData ? formatWeatherStatus(weatherData.current.weather[0].description) : 'LOADING...'}
              </Text>
              
              <Text style={styles.dateTime}>{formatDateTime(currentDateTime)}</Text>

              {/* View This Week */}
              <TouchableOpacity style={styles.viewWeekButton}>
                <Text style={styles.viewWeekText}>View this week</Text>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>

              {/* Bottom Info Grid */}
              <View style={styles.infoGrid}>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <SunIcon />
                    <Text style={styles.mainInfoLabel}>Sunrise</Text>
                    <Text style={styles.mainInfoValue}>
                      {weatherData ? formatTime(weatherData.current.sunrise) : '5:53 am'}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <MoonIcon />
                    <Text style={styles.mainInfoLabel}>Sunset</Text>
                    <Text style={styles.mainInfoValue}>
                      {weatherData ? formatTime(weatherData.current.sunset) : '6:45 pm'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Air quality</Text>
                    <Text style={styles.infoValue}>
                      {/* Air quality not available in 2.5 API - using static fallback */}
                      52 Moderate
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>UV Index</Text>
                    <Text style={styles.infoValue}>
                      {weatherData ? 
                        `${Math.round(weatherData.current.uvi)} ${getUVDescription(weatherData.current.uvi)}` : 
                        '4 Normal'
                      }
                    </Text>
                  </View>
                </View>
                
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Precipitation</Text>
                    <Text style={styles.infoValue}>
                      {weatherData ? 
                        `${Math.round((weatherData.hourly?.[0]?.pop || 0) * 100)}%` : 
                        '87%'
                      }
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Humidity</Text>
                    <Text style={styles.infoValue}>
                      {weatherData ? `${weatherData.current.humidity}%` : '78%'}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </Animated.View>
      </LinearGradient>

      {/* Menu Overlay */}
      {menuVisible && (
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            onPress={toggleMenu}
            activeOpacity={1}
          />
        </Animated.View>
      )}

      {/* Side Menu */}
      {menuVisible && (
        <Animated.View
          style={[
            styles.sideMenu,
            { 
              transform: [{ translateX: slideAnim }],
              backgroundColor: theme.menuBackground
            }
          ]}
        >
          <View style={styles.menuHeader}>
            <Text style={[styles.menuTitle, { color: theme.menuText }]}>Settings</Text>
            <TouchableOpacity onPress={toggleMenu}>
              <Text style={[styles.closeButton, { color: theme.menuText }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuContent}>
            <TouchableOpacity 
              style={[styles.menuSection, { borderBottomColor: theme.menuBorder }]}
              onPress={() => setLocationDropdownVisible(!locationDropdownVisible)}
            >
              <MaterialIcons name="location-on" size={24} color={theme.menuIcon} style={styles.menuSectionIcon} />
              <View style={styles.menuSectionContent}>
                <Text style={[styles.menuSectionTitle, { color: theme.menuText }]}>Location</Text>
                <Text style={[styles.menuSectionValue, { color: theme.menuSubText }]}>{selectedLocation}</Text>
              </View>
              <MaterialIcons 
                name={locationDropdownVisible ? "keyboard-arrow-down" : "keyboard-arrow-right"} 
                size={24} 
                color={theme.menuSubText}
              />
            </TouchableOpacity>
            
            {locationDropdownVisible && (
              <View style={[styles.dropdownMenu, { 
                backgroundColor: theme.dropdownBackground,
                borderColor: theme.menuBorder
              }]}>
                {countries.map((country) => (
                  <TouchableOpacity
                    key={country}
                    style={styles.dropdownItem}
                    onPress={async () => {
                      await handleLocationChange(country);
                      setLocationDropdownVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownText, 
                      { color: theme.dropdownText },
                      selectedLocation === country && { color: theme.selectedText }
                    ]}>
                      {country}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity 
              style={[styles.menuSection, { borderBottomColor: theme.menuBorder }]}
              onPress={() => setTemperatureDropdownVisible(!temperatureDropdownVisible)}
            >
              <MaterialCommunityIcons name="thermometer" size={24} color={theme.menuIcon} style={styles.menuSectionIcon} />
              <View style={styles.menuSectionContent}>
                <Text style={[styles.menuSectionTitle, { color: theme.menuText }]}>Temperature</Text>
                <Text style={[styles.menuSectionValue, { color: theme.menuSubText }]}>{temperatureUnit}</Text>
              </View>
              <MaterialIcons 
                name={temperatureDropdownVisible ? "keyboard-arrow-down" : "keyboard-arrow-right"} 
                size={24} 
                color={theme.menuSubText}
              />
            </TouchableOpacity>

            {temperatureDropdownVisible && (
              <View style={[styles.dropdownMenu, { 
                backgroundColor: theme.dropdownBackground,
                borderColor: theme.menuBorder
              }]}>
                {['Celsius', 'Fahrenheit'].map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setTemperatureUnit(unit);
                      setTemperatureDropdownVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownText, 
                      { color: theme.dropdownText },
                      temperatureUnit === unit && { color: theme.selectedText }
                    ]}>
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={[styles.menuSection, { borderBottomColor: theme.menuBorder }]}>
              <Ionicons 
                name={isDarkTheme ? "moon" : "sunny"} 
                size={24} 
                color={theme.menuIcon} 
                style={styles.menuSectionIcon} 
              />
              <View style={styles.menuSectionContent}>
                <Text style={[styles.menuSectionTitle, { color: theme.menuText }]}>Theme</Text>
                <Text style={[styles.menuSectionValue, { color: theme.menuSubText }]}>{isDarkTheme ? 'Dark' : 'Light'}</Text>
              </View>
              <Switch
                value={isDarkTheme}
                onValueChange={() => setIsDarkTheme(!isDarkTheme)}
                trackColor={theme.switchTrackColor}
                thumbColor={theme.switchThumbColor}
              />
            </View>

            <View style={[styles.menuSection, { borderBottomColor: theme.menuBorder }]}>
              <MaterialIcons 
                name="accessibility" 
                size={24} 
                color={theme.menuIcon} 
                style={styles.menuSectionIcon} 
              />
              <View style={styles.menuSectionContent}>
                <Text style={[styles.menuSectionTitle, { color: theme.menuText }]}>Accessibility</Text>
                <Text style={[styles.menuSectionValue, { color: theme.menuSubText }]}>Colorblind Mode</Text>
              </View>
              <Switch
                value={isColorblindMode}
                onValueChange={() => setIsColorblindMode(!isColorblindMode)}
                trackColor={theme.switchTrackColor}
                thumbColor={theme.switchThumbColor}
              />
            </View>
          </View>

          <View style={styles.menuFooter}>
            <Text style={[styles.createdBy, { color: theme.menuSubText }]}>Created by Won Lee</Text>
            <TouchableOpacity 
              onPress={() => Linking.openURL('https://github.com/wonseobi')}
              style={[styles.githubIcon, { backgroundColor: theme.menuBorder }]}
            >
              <FontAwesome name="github" size={24} color={theme.menuIcon} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default WeatherApp;