import { Tabs } from "expo-router";
import { Image, View } from 'react-native';
import React from 'react';

export default () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false, // Hide the labels to show icons only
        tabBarStyle: {  
          height: 60, // Adjust tab bar height if needed
          backgroundColor: '#fff', // White background for the tab bar
          borderTopWidth: 0, // Remove the top border
          position: 'absolute', // Make it floating
          borderRadius: 30, // Rounded corners
          marginHorizontal: 20, // Add some horizontal margin to separate from screen edges
          marginBottom: 10, // Adjust bottom margin if needed
          elevation: 10, // Add shadow for Android
          shadowColor: '#000', // Shadow color for iOS
          shadowOffset: { width: 0, height: 5 }, // Shadow positioning
          shadowOpacity: 0.3,
          shadowRadius: 5,
        },
      }}
    >
      {/* Home Screen */}
      <Tabs.Screen
        name="Home"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{
                backgroundColor: focused ? 'rgba(128, 128, 128, 0.3)' : 'transparent',
                borderRadius: 30,
                paddingHorizontal: 15, // Adjusted padding to increase space
                paddingVertical: 10, // Added vertical padding for better touch area
              }}>
            <Image
              source={require('../assets/Data-analysis.png')}
              style={{
                width: 30,
                height: 30,
              }}
            />
            </View>
          ),
        }}
      />

      {/* Gallery Screen */}
      <Tabs.Screen
        name="Gallery"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{
                backgroundColor: focused ? 'rgba(128, 128, 128, 0.3)' : 'transparent',
                borderRadius: 30,
                paddingHorizontal: 15, // Adjusted padding to increase space
                paddingVertical: 10, // Added vertical padding for better touch area
              }}>
            <Image
              source={require('../assets/Galery.png')}
              style={{
                width: 30,
                height: 30,
              }}
            />
            </View>
          ),
        }}
      />

      {/* Camera Screen - Center Button */}
      <Tabs.Screen
        name="CameraPage"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{
              width: 70, // Width of the camera button
              height: 70, // Height of the camera button
              backgroundColor: '#fff', // White background for the camera button
              borderRadius: 35, // Make the camera button fully circular
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 50, // Make the button float above the tab bar
              shadowColor: '#000000', // Add shadow for depth
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 1,
              shadowRadius: 5,
              elevation: 5, // Shadow for Android
            }}>
              <View style={{
                backgroundColor: focused ? 'rgba(128, 128, 128, 0.3)' : 'transparent',
                borderRadius: 30,
                padding: 10, // Increased padding for a wider background
              }}>
            <Image
              source={require('../assets/Camera.png')}
              style={{
                width: 30,
                height: 30,
              }}
            />
            </View>
            </View>
          ),
        }}
      />

      {/* Handgun Screen */}
      <Tabs.Screen
        name="HandGun"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{
                backgroundColor: focused ? 'rgba(128, 128, 128, 0.3)' : 'transparent',
                borderRadius: 30,
                paddingHorizontal: 15, // Adjusted padding to increase space
                paddingVertical: 10, // Added vertical padding for better touch area
              }}>
            <Image
              source={require('../assets/Handgun.png')}
              style={{
                width: 30,
                height: 30,
              }}
            />
            </View>
          ),
        }}
      />

      {/* Profile Screen */}
      <Tabs.Screen
        name="Profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{
                backgroundColor: focused ? 'rgba(128, 128, 128, 0.3)' : 'transparent',
                borderRadius: 30,
                paddingHorizontal: 15, // Adjusted padding to increase space
                paddingVertical: 10, // Added vertical padding for better touch area
              }}>
            <Image
              source={require('../assets/Profile.png')}
              style={{
                width: 30,
                height: 30,
              }}
            />
            </View>
          ),
        }}
      />
    </Tabs>
  );
};
