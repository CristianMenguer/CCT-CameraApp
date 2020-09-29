import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


import PhotoScreen from './src/pages/PhotoScreen'
import GalleryScreen from './src/pages/GalleryScreen'
import HomeScreen from './src/pages/HomeScreen'


const Tab = createBottomTabNavigator()

export default function App() {
    return (
        <>
            <NavigationContainer >
                <Tab.Navigator initialRouteName="Home"
                    tabBarOptions={{
                        activeTintColor: '#e91e63',
                        labelPosition: 'below-icon'
                    }}>
                    <Tab.Screen name="Photo"
                        component={PhotoScreen}
                        options={{
                            tabBarLabel: 'Photo',
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="camera" color={color} size={size} />
                            ),
                        }} />
                    <Tab.Screen name="Home"
                        component={HomeScreen}
                        options={{
                            tabBarLabel: 'Home',
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="home" color={color} size={size} />
                            ),
                        }}
                    />
                    <Tab.Screen name="Gallery"
                        component={GalleryScreen}
                        options={{
                            tabBarLabel: 'Gallery',
                            tabBarIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="camera-burst" color={color} size={size} />
                            ),
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </>


    )

}
