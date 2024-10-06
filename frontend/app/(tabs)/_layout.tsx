import React from 'react';
import { Tabs } from "expo-router";
import { Image, View, ImageSourcePropType } from 'react-native';

interface TabIconProps {
  source: ImageSourcePropType;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ source, focused }) => (
  <View style={{
    backgroundColor: focused ? 'rgba(128, 128, 128, 0.2)' : 'transparent',
    borderRadius: 12,
    padding: 8,
  }}>
    <Image
      source={source}
      style={{
        width: 24,
        height: 24,
        opacity: focused ? 1 : 0.7,
      }}
    />
  </View>
);

interface CameraButtonProps {
  focused: boolean;
}

const CameraButton: React.FC<CameraButtonProps> = ({ focused }) => (
  <View style={{ alignItems: 'center' }}>
    <View style={{
      position: 'absolute',
      width: 80,
      height: 80,
      backgroundColor: '#f0f0f0',
      borderRadius: 40,
      bottom: 30,
      zIndex: -1,
    }} />
    <View style={{
      width: 64,
      height: 64,
      backgroundColor: '#fff',
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 40,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    }}>
      <TabIcon source={require('../assets/Camera.png')} focused={focused} />
    </View>
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          position: 'absolute',
          borderRadius: 20,
          marginHorizontal: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={require('../assets/Data-analysis.png')} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="Gallery"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={require('../assets/Galery.png')} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="CameraPage"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <CameraButton focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="HandGun"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={require('../assets/Handgun.png')} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={require('../assets/Profile.png')} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}