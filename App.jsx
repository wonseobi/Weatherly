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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons
} from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const WeatherApp = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [locationDropdownVisible, setLocationDropdownVisible] = useState(false);
  const [temperatureDropdownVisible, setTemperatureDropdownVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('South Korea');
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius');
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isColorblindMode, setIsColorblindMode] = useState(false);
  const [slideAnim] = useState(new Animated.Value(width * 0.8));
  const [overlayAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const [slideUpAnim] = useState(new Animated.Value(20));

  const countries = ['Mexico', 'South Korea', 'United States', 'Japan', 'China', 'United Kingdom', 'Canada', 'Australia'];

  useEffect(() => {
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
  }, []);

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
              <Text style={styles.locationLabel}>Location</Text>
              <Text style={styles.greeting}>Good Afternoon</Text>
            </View>
            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
              <MenuIcon />
            </TouchableOpacity>
          </View>

          {/* Weather Icon Placeholder */}
          <View style={styles.weatherIconContainer}>
            <Text style={styles.weatherIconPlaceholder}>
              🌦️
            </Text>
          </View>

          {/* Temperature */}
          <Text style={styles.temperature}>24°C</Text>
          <Text style={styles.weatherStatus}>RAINING</Text>
          <Text style={styles.dateTime}>MONDAY 18th 4:52pm</Text>

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
                <Text style={styles.mainInfoValue}>5:53 am</Text>
              </View>
              <View style={styles.infoItem}>
                <MoonIcon />
                <Text style={styles.mainInfoLabel}>Sunset</Text>
                <Text style={styles.mainInfoValue}>6:45 pm</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Air quality</Text>
                <Text style={styles.infoValue}>52 Moderate</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>UV Index</Text>
                <Text style={styles.infoValue}>4 Normal</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Precipitation</Text>
                <Text style={styles.infoValue}>87%</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Humidity</Text>
                <Text style={styles.infoValue}>78%</Text>
              </View>
            </View>
          </View>
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
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Settings</Text>
            <TouchableOpacity onPress={toggleMenu}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuContent}>
            <TouchableOpacity 
              style={styles.menuSection}
              onPress={() => setLocationDropdownVisible(!locationDropdownVisible)}
            >
              <MaterialIcons name="location-on" size={24} color="#fff" style={styles.menuSectionIcon} />
              <View style={styles.menuSectionContent}>
                <Text style={styles.menuSectionTitle}>Location</Text>
                <Text style={styles.menuSectionValue}>{selectedLocation}</Text>
              </View>
              <MaterialIcons 
                name={locationDropdownVisible ? "keyboard-arrow-down" : "keyboard-arrow-right"} 
                size={24} 
                color="#888" 
              />
            </TouchableOpacity>
            
            {locationDropdownVisible && (
              <View style={styles.dropdownMenu}>
                {countries.map((country) => (
                  <TouchableOpacity
                    key={country}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedLocation(country);
                      setLocationDropdownVisible(false);
                    }}
                  >
                    <Text style={[styles.dropdownText, selectedLocation === country && styles.selectedDropdownText]}>
                      {country}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity 
              style={styles.menuSection}
              onPress={() => setTemperatureDropdownVisible(!temperatureDropdownVisible)}
            >
              <MaterialCommunityIcons name="thermometer" size={24} color="#fff" style={styles.menuSectionIcon} />
              <View style={styles.menuSectionContent}>
                <Text style={styles.menuSectionTitle}>Temperature</Text>
                <Text style={styles.menuSectionValue}>{temperatureUnit}</Text>
              </View>
              <MaterialIcons 
                name={temperatureDropdownVisible ? "keyboard-arrow-down" : "keyboard-arrow-right"} 
                size={24} 
                color="#888" 
              />
            </TouchableOpacity>

            {temperatureDropdownVisible && (
              <View style={styles.dropdownMenu}>
                {['Celsius', 'Fahrenheit'].map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setTemperatureUnit(unit);
                      setTemperatureDropdownVisible(false);
                    }}
                  >
                    <Text style={[styles.dropdownText, temperatureUnit === unit && styles.selectedDropdownText]}>
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.menuSection}>
              <Ionicons name={isDarkTheme ? "moon" : "sunny"} size={24} color="#fff" style={styles.menuSectionIcon} />
              <View style={styles.menuSectionContent}>
                <Text style={styles.menuSectionTitle}>Theme</Text>
                <Text style={styles.menuSectionValue}>{isDarkTheme ? 'Dark' : 'Light'}</Text>
              </View>
              <Switch
                value={isDarkTheme}
                onValueChange={() => setIsDarkTheme(!isDarkTheme)}
                trackColor={{ false: '#555', true: '#4CAF50' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.menuSection}>
              <MaterialIcons name="accessibility" size={24} color="#fff" style={styles.menuSectionIcon} />
              <View style={styles.menuSectionContent}>
                <Text style={styles.menuSectionTitle}>Accessibility</Text>
                <Text style={styles.menuSectionValue}>Colorblind Mode</Text>
              </View>
              <Switch
                value={isColorblindMode}
                onValueChange={() => setIsColorblindMode(!isColorblindMode)}
                trackColor={{ false: '#555', true: '#4CAF50' }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <View style={styles.menuFooter}>
            <Text style={styles.createdBy}>Created by Won Lee</Text>
            <TouchableOpacity 
              onPress={() => Linking.openURL('https://github.com/wonseobi')}
              style={styles.githubIcon}
            >
              <FontAwesome name="github" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  locationLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 4,
  },
  greeting: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  menuButton: {
    padding: 2,
  },
  menuIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    backgroundColor: 'black',
    borderRadius: 2,
    marginVertical: 1.5,
  },
  weatherIconContainer: {
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: 50,
  },
  weatherIconPlaceholder: {
    fontSize: 80,
  },
  temperature: {
    color: 'white',
    fontSize: 64,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 8,
  },
  weatherStatus: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 8,
  },
  dateTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  viewWeekButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  viewWeekText: {
    color: '#ba74ffff',
    fontWeight: 450,
    fontSize: 16,
    marginRight: 8,
  },
  arrow: {
    color: '#C78FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoGrid: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 60,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  mainInfoLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginBottom: 4,
    paddingLeft: 65,
  },
  infoLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginBottom: 4,
    paddingLeft: 35,
  },
  infoValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '300',
    paddingLeft: 35,
  },
  mainInfoValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '300',
    paddingLeft: 65,
  },
  emojiIcon: {
    fontSize: 30,
    position: 'absolute',
    left: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTouchable: {
    flex: 1,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.75,
    height: height,
    backgroundColor: '#0e0e0eff',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  menuTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '350',
  },
  closeButton: {
    color: 'white',
    fontSize: 24,
    fontWeight: '300',
  },
  menuContent: {
    flex: 1,
  },
  menuSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuSectionIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
  },
  menuSectionContent: {
    flex: 1,
  },
  menuSectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 2,
  },
  menuSectionValue: {
    color: '#888',
    fontSize: 14,
  },
  menuArrow: {
    color: '#888',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdownMenu: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    marginLeft: 40,
    marginTop: -10,
    marginBottom: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dropdownText: {
    color: '#717171ff',
    fontSize: 14,
  },
  selectedDropdownText: {
    color: '#ffffffff',
    fontWeight: '500',
  },
  menuFooter: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  createdBy: {
    color: '#888',
    fontSize: 14,
    marginBottom: 12,
  },
  githubIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WeatherApp;