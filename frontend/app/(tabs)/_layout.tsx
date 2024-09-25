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
          borderRadius: 15, // Rounded corners
          marginHorizontal: 10, // Add some horizontal margin to separate from screen edges
          marginBottom: 10, // Adjust bottom margin if needed
          elevation: 5, // Add shadow for Android
          shadowColor: '#000', // Shadow color for iOS
          shadowOffset: { width: 0, height: 2 }, // Shadow positioning
          shadowOpacity: 0.1,
          shadowRadius: 2,
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
                borderRadius: 12,
                paddingHorizontal: 15,
                paddingVertical: 8,
              }}>
            <Image
              source={require('../assets/Data-analysis.png')}
              style={{
                width: 35,
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
                borderRadius: 12,
                paddingHorizontal: 15,
                paddingVertical: 8,
              }}>
            <Image
              source={require('../assets/Galery.png')}
              style={{
                width: 35,
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
            <View style={{ alignItems: 'center' }}>
              {/* Circle Background */}
              <View style={{
                position: 'absolute',
                width: 92, // Width of the circle
                height: 92, // Height of the circle
                backgroundColor: '#f3f3f3', // Circle color
                borderRadius: 45, // Make it circular
                justifyContent: 'center',
                alignItems: 'center',
                bottom: 50, // Position above the tab bar
                zIndex: -1, // Send it to the back
              }} />
              
              {/* Camera Button */}
              <View style={{
                width: 72,
                height: 72,
                backgroundColor: '#fff',
                borderRadius: 35,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 60,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 1,
                shadowRadius: 5,
                elevation: 5,
              }}>
                <View style={{
                  backgroundColor: focused ? 'rgba(128, 128, 128, 0.3)' : 'transparent',
                  borderRadius: 70,
                  padding: 9,
                }}>
                  <Image
                    source={require('../assets/Camera.png')}
                    style={{
                      width: 35,
                      height: 35,
                    }}
                  />
                </View>
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
                borderRadius: 12,
                paddingHorizontal: 15,
                paddingVertical: 8,
              }}>
            <Image
              source={require('../assets/Handgun.png')}
              style={{
                width: 35,
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
                borderRadius: 12,
                paddingHorizontal: 15,
                paddingVertical: 8,
              }}>
            <Image
              source={require('../assets/Profile.png')}
              style={{
                width: 35,
                height: 30,
              }}
            />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}