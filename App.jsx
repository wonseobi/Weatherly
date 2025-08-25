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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const WeatherApp = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width * 0.8));
  const [overlayAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const [slideUpAnim] = useState(new Animated.Value(20));

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
          toValue: -width * 0.8,
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

  const GitHubIcon = () => (
    <View style={styles.githubIcon}>
      <View style={styles.githubShape} />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#FF8C00', '#FF6B35', '#8B4A9C', '#4A4A8B']}
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
                <Text style={styles.infoLabel}>Sunrise</Text>
                <Text style={styles.infoValue}>5:53 am</Text>
              </View>
              <View style={styles.infoItem}>
                <MoonIcon />
                <Text style={styles.infoLabel}>Sunset</Text>
                <Text style={styles.infoValue}>6:45 pm</Text>
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
            <View style={styles.menuSection}>
              <Text style={styles.menuSectionIcon}>📍</Text>
              <View style={styles.menuSectionContent}>
                <Text style={styles.menuSectionTitle}>Location</Text>
                <Text style={styles.menuSectionValue}>South Korea</Text>
              </View>
              <Text style={styles.menuArrow}>‹</Text>
            </View>

            <View style={styles.menuSection}>
              <Text style={styles.menuSectionIcon}>🌡️</Text>
              <View style={styles.menuSectionContent}>
                <Text style={styles.menuSectionTitle}>Temperature</Text>
                <Text style={styles.menuSectionValue}>Celsius Degrees C°</Text>
              </View>
              <Text style={styles.menuArrow}>‹</Text>
            </View>

            <View style={styles.menuSection}>
              <Text style={styles.menuSectionIcon}>🌓</Text>
              <View style={styles.menuSectionContent}>
                <Text style={styles.menuSectionTitle}>Theme</Text>
                <Text style={styles.menuSectionValue}>Light</Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: '#555', true: '#4CAF50' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.menuSection}>
              <Text style={styles.menuSectionIcon}>♿</Text>
              <View style={styles.menuSectionContent}>
                <Text style={styles.menuSectionTitle}>Accessibility</Text>
                <Text style={styles.menuSectionValue}>Colorblind Mode</Text>
              </View>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: '#555', true: '#4CAF50' }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <View style={styles.menuFooter}>
            <Text style={styles.createdBy}>Created by Won Lee</Text>
            <GitHubIcon />
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
    padding: 8,
  },
  menuIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    backgroundColor: 'white',
    borderRadius: 2,
    marginVertical: 1,
  },
  weatherIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 8,
  },
  dateTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
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
    color: '#C78FFF',
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
    paddingBottom: 40,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  infoLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  emojiIcon: {
    fontSize: 20,
    marginBottom: 8,
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
    left: 0,
    width: width * 0.8,
    height: height,
    backgroundColor: '#1a1a1a',
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
    fontWeight: '600',
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
    fontWeight: '500',
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
    transform: [{ rotate: '180deg' }],
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
    width: 32,
    height: 32,
    backgroundColor: '#333',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  githubShape: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});

export default WeatherApp;