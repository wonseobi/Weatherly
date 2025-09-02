import React, { useState, useEffect, useRef } from 'react';
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
  Image,
  ScrollView,
  RefreshControl,
  PanGestureHandler,
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
const { width, height } = Dimensions.get('window');

// Import weather images
const weatherImages = {
  sunny: require('./src/assets/sunny.png'),
  sunny_alt: require('./src/assets/sunny_alt.png'),
  cloudy: require('./src/assets/cloudy.png'),
  overcast: require('./src/assets/overcast.png'),
  overcast_alt: require('./src/assets/overcast_alt.png'),
  raining: require('./src/assets/raining.png'),
  raining_alt: require('./src/assets/raining_alt.png'),
  snowing: require('./src/assets/snowing.png'),
  thunderstorm: require('./src/assets/thunderstorm.png'),
  foggy: require('./src/assets/foggy.png'),
};

// OpenWeatherMap API configuration
const API_KEY = '5b549a8a3d848027af3b29231469a8fb';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Location coordinates for different countries/cities
const LOCATION_COORDINATES = {
  'Mexico': { lat: 19.4326, lon: -99.1332, name: 'Mexico City, Mexico' },
  'South Korea': { lat: 37.5665, lon: 126.9780, name: 'Seoul, South Korea' },
  'United States': { lat: 40.7128, lon: -74.0060, name: 'New York, United States' },
  'Japan': { lat: 35.6762, lon: 139.6503, name: 'Tokyo, Japan' },
  'China': { lat: 39.9042, lon: 116.4074, name: 'Beijing, China' },
  'United Kingdom': { lat: 51.5074, lon: -0.1278, name: 'London, United Kingdom' },
  'Canada': { lat: 45.4215, lon: -75.6972, name: 'Ottawa, Canada' },
  'Australia': { lat: -33.8688, lon: 151.2093, name: 'Sydney, Australia' },
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
  const [refreshing, setRefreshing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  
  const theme = isDarkTheme ? darkTheme : lightTheme;

  // Animation values
  const [slideAnim] = useState(new Animated.Value(width * 0.8));
  const [overlayAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const [slideUpAnim] = useState(new Animated.Value(20));
  const [weatherImageScale] = useState(new Animated.Value(1));
  const [weatherImageRotate] = useState(new Animated.Value(0));
  const [contentOpacity] = useState(new Animated.Value(1));
  const [pullIndicatorScale] = useState(new Animated.Value(0));

  const countries = ['Current Location', 'Mexico', 'South Korea', 'United States', 'Japan', 'China', 'United Kingdom', 'Canada', 'Australia'];

  // Convert temperature based on selected unit
  const convertTemperature = (temp) => {
    if (temperatureUnit === 'Fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
  };

  // Check if it's nighttime for selecting appropriate weather icons
  const isNightTime = () => {
    const hour = new Date().getHours();
    return hour >= 20 || hour < 6; // Consider 8 PM to 6 AM as night
  };

  // Get weather image based on weather condition and time of day
  const getWeatherImage = (weatherMain, weatherDescription) => {
    const isNight = isNightTime();
    const lowerDescription = weatherDescription?.toLowerCase() || '';
    
    // Map OpenWeatherMap conditions to your image assets
    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return isNight ? weatherImages.sunny_alt : weatherImages.sunny;
      
      case 'clouds':
        if (lowerDescription.includes('few clouds') || lowerDescription.includes('scattered')) {
          return weatherImages.cloudy;
        }
        return isNight ? weatherImages.overcast_alt : weatherImages.overcast;
      
      case 'rain':
      case 'drizzle':
        return isNight ? weatherImages.raining_alt : weatherImages.raining;
      
      case 'thunderstorm':
        return weatherImages.thunderstorm;
      
      case 'snow':
        return weatherImages.snowing;
      
      case 'mist':
      case 'fog':
      case 'haze':
      case 'smoke':
      case 'dust':
      case 'sand':
        return weatherImages.foggy;
      
      default:
        return isNight ? weatherImages.overcast_alt : weatherImages.overcast;
    }
  };

  // Animate weather icon change with scaling only
const animateWeatherIconChange = () => {
  Animated.sequence([
    Animated.timing(weatherImageScale, {
      toValue: 0.8,   // Scale down to 80%
      duration: 200,  // Duration of the scale-down animation
      useNativeDriver: true,
    }),
    Animated.timing(weatherImageScale, {
      toValue: 1,    // Scale back to original size (100%)
      duration: 200, // Duration of the scale-up animation
      useNativeDriver: true,
    })
  ]).start();
};

  // Format weather status
  const formatWeatherStatus = (description) => {
    return description?.toUpperCase() || 'LOADING...';
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

  // Get precipitation probability from weather data
  const getPrecipitationChance = (weatherData) => {
    if (!weatherData) return 0;
    
    // For current weather, estimate precipitation based on weather conditions
    const weather = weatherData.current?.weather?.[0];
    if (!weather) return 0;
    
    const condition = weather.main?.toLowerCase();
    const description = weather.description?.toLowerCase() || '';
    
    // Estimate precipitation chance based on weather conditions
    switch (condition) {
      case 'rain':
        if (description.includes('heavy')) return 90;
        if (description.includes('moderate')) return 70;
        if (description.includes('light')) return 50;
        return 80;
      case 'drizzle':
        return 40;
      case 'thunderstorm':
        return 95;
      case 'snow':
        return 85;
      case 'clouds':
        if (description.includes('overcast')) return 30;
        if (description.includes('broken')) return 20;
        return 10;
      case 'mist':
      case 'fog':
        return 15;
      default:
        return 5;
    }
  };

  // Fetch weather data from OpenWeatherMap API
  const fetchWeatherData = async (lat, lon, cityName, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (!weatherData) {
        setLoading(true);
      } else {
        setIsUpdating(true);
      }

      const url = cityName && !cityName.includes('Current')
        ? `${BASE_URL}?q=${cityName}&appid=${API_KEY}&units=metric`
        : `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();

      const mappedData = {
        current: {
          temp: data.main.temp,
          humidity: data.main.humidity,
          uvi: 4, // Default UV index since free plan doesn't provide it
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset,
          weather: data.weather,
          pressure: data.main.pressure,
          visibility: data.visibility,
          windSpeed: data.wind?.speed || 0,
        },
        hourly: [{ pop: getPrecipitationChance({ current: { weather: data.weather } }) / 100 }]
      };

      // Animate content change
      if (weatherData) {
        animateWeatherIconChange();
        Animated.sequence([
          Animated.timing(contentOpacity, {
            toValue: 0.7,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(contentOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
      }

      setWeatherData(mappedData);
      
    } catch (error) {
      console.error('Error fetching weather data:', error);
      if (!weatherData) {
        Alert.alert('Error', 'Failed to fetch weather data. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsUpdating(false);
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

      const [placeDetails] = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      if (placeDetails) {
        const locationName = placeDetails.city || placeDetails.region || placeDetails.country || 'Current Location';
        setCurrentLocationName(locationName);
        await fetchWeatherData(latitude, longitude, locationName);
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
        await fetchWeatherData(currentCoordinates.lat, currentCoordinates.lon, currentLocationName);
      } else {
        await getCurrentLocation();
      }
    } else {
      const coordinates = LOCATION_COORDINATES[location];
      if (coordinates) {
        await fetchWeatherData(coordinates.lat, coordinates.lon, coordinates.name);
      }
    }
  };

  // Handle pull to refresh
  const onRefresh = async () => {
    if (selectedLocation === 'Current Location') {
      if (currentCoordinates) {
        await fetchWeatherData(currentCoordinates.lat, currentCoordinates.lon, currentLocationName, true);
      } else {
        await getCurrentLocation();
      }
    } else {
      const coordinates = LOCATION_COORDINATES[selectedLocation];
      if (coordinates) {
        await fetchWeatherData(coordinates.lat, coordinates.lon, coordinates.name, true);
      }
    }
  };

  const formatDateTime = (date) => {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const day = days[date.getDay()];
    const dateNum = date.getDate();
    
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

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideUpAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
    ]).start();

    const timer = setInterval(() => { setCurrentDateTime(new Date()); }, 60000);

    getCurrentLocation();

    return () => clearInterval(timer);
  }, []);

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: width * 0.8, duration: 300, useNativeDriver: true }),
        Animated.timing(overlayAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(overlayAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
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

  const SunIcon = () => (<Text style={styles.emojiIcon}>☀️</Text>);
  const MoonIcon = () => (<Text style={styles.emojiIcon}>🌙</Text>);

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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
              title="Pull to refresh"
              titleColor="#FFFFFF"
            />
          }
          showsVerticalScrollIndicator={false}
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
                  {isUpdating && <Text style={styles.updatingIndicator}>  ●</Text>}
                </Text>
                <Text style={styles.greeting}>{getTimeBasedGreeting()}</Text>
              </View>
              <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                <MenuIcon />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingText}>Loading weather data...</Text>
              </View>
            ) : (
              <Animated.View style={{ opacity: contentOpacity }}>
                <View style={styles.weatherIconContainer}>
                  <Animated.View style={{
                    transform: [
                      { scale: weatherImageScale }, // Apply scale animation
                    ]
                  }}>
                    <Image
                      source={weatherData ? getWeatherImage(weatherData.current.weather[0].main, weatherData.current.weather[0].description) : weatherImages.sunny}
                      style={styles.weatherImage}
                      resizeMode="contain"
                    />
                  </Animated.View>
                </View>

                <Text style={styles.temperature}>
                  {weatherData ? `${convertTemperature(weatherData.current.temp)}°${temperatureUnit === 'Celsius' ? 'C' : 'F'}` : '24°C'}
                </Text>
                
                <Text style={styles.weatherStatus}>
                  {weatherData ? formatWeatherStatus(weatherData.current.weather[0].description) : 'LOADING...'}
                </Text>
                
                <Text style={styles.dateTime}>{formatDateTime(currentDateTime)}</Text>

                <TouchableOpacity style={styles.viewWeekButton}>
                  <Text style={styles.viewWeekText}>View this week</Text>
                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>

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
                      <Text style={styles.infoValue}>52 Moderate</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>UV Index</Text>
                      <Text style={styles.infoValue}>
                        {weatherData ? `${Math.round(weatherData.current.uvi)} Normal` : '4 Normal'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Precipitation</Text>
                      <Text style={styles.infoValue}>
                        {weatherData ? `${Math.round((weatherData.hourly?.[0]?.pop || 0) * 100)}%` : '0%'}
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
              </Animated.View>
            )}
          </Animated.View>
        </ScrollView>
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