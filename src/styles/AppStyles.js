import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const lightTheme = {
  menuBackground: '#ffffff',
  menuText: '#000000',
  menuSubText: '#666666',
  menuBorder: '#e0e0e0',
  menuIcon: '#333333',
  dropdownBackground: '#f5f5f5',
  dropdownText: '#333333',
  selectedText: '#4CAF50',
  switchTrackColor: { false: '#cccccc', true: '#4CAF50' },
  switchThumbColor: '#ffffff',
};

export const darkTheme = {
  menuBackground: '#0e0e0eff',
  menuText: '#ffffff',
  menuSubText: '#888888',
  menuBorder: '#333333',
  menuIcon: '#ffffff',
  dropdownBackground: '#1a1a1a',
  dropdownText: '#717171ff',
  selectedText: '#ffffffff',
  switchTrackColor: { false: '#555555', true: '#4CAF50' },
  switchThumbColor: '#ffffff',
};

export const styles = StyleSheet.create({
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
    paddingTop: 20,
  },
  weatherIconPlaceholder: {
    fontSize: 80,
  },
  temperature: {
    color: 'white',
    fontSize: 56,
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
    fontWeight: '450',
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
  weatherImage: {
    position: 'relative',
    width: 200,
    height: 200,
},
});
