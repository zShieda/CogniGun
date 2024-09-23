import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const HomeScreen = () => {
  const [selectedTab, setSelectedTab] = useState('profile'); 

  const renderContent = () => {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={require('./assets/tranpLOGO.png')}
          style={styles.contentImage}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        {/* Profile Icon */}
        <TouchableOpacity onPress={() => setSelectedTab('profile')} style={styles.profileContainer}>
          <Image
            source={require('./assets/Profile.png')} 
            style={[
              styles.icon,
              { tintColor: selectedTab === 'profile' ? '#de4b4b' : '#732626' }, 
            ]}
          />
        </TouchableOpacity>

        {/* Icons Group */}
        <View style={styles.iconsGroup}>
          <TouchableOpacity onPress={() => setSelectedTab('dashboard')} style={styles.iconContainer}>
            <Image
              source={require('./assets/Data-analysis.png')}
              style={[styles.icon, selectedTab === 'dashboard' && styles.selectedIcon]}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSelectedTab('gun')} style={styles.iconContainer}>
            <Image
              source={require('./assets/Handgun.png')}
              style={[styles.icon, selectedTab === 'gun' && styles.selectedIcon]}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSelectedTab('camera')} style={styles.iconContainer}>
            <Image
              source={require('./assets/Camera.png')}
              style={[styles.icon, selectedTab === 'camera' && styles.selectedIcon]}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSelectedTab('gallery')} style={styles.iconContainer}>
            <Image
              source={require('./assets/Galery.png')}
              style={[styles.icon, selectedTab === 'gallery' && styles.selectedIcon]}
            />
          </TouchableOpacity>
        </View>

        {/* Logout Icon */}
        <TouchableOpacity onPress={() => setSelectedTab('settings')} style={styles.logoutContainer}>
          <Image
            source={require('./assets/Logout.png')}
            style={[styles.icon, selectedTab === 'settings' && styles.selectedIcon]}
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: '15%',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 35,
  },
  profileContainer: {
    marginBottom: 40, 
    padding: 10,
  },
  iconsGroup: {
    flex: 1, 
    justifyContent: 'center', 
  },
  iconContainer: {
    marginVertical: 10,
    padding: 15,
  },
  logoutContainer: {
    marginVertical: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  selectedIcon: {
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  contentImage: {
    width: 200, 
    height: 200,
    resizeMode: 'contain',
    opacity: 0.4,
  },
});

export default HomeScreen;