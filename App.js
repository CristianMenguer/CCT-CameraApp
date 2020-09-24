import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import PhotoScreen from './src/pages/PhotoScreen'
import GalleryScreen from './src/pages/GalleryScreen'
import HomeScreen from './src/pages/HomeScreen'


const Tab = createBottomTabNavigator()

export default function App() {

    return (
        <>
            <NavigationContainer>
                <Tab.Navigator initialRouteName="Home" >
                    <Tab.Screen name="Photo" component={PhotoScreen} />
                    <Tab.Screen name="Home" component={HomeScreen} />
                    <Tab.Screen name="Gallery" component={GalleryScreen} />
                </Tab.Navigator>
            </NavigationContainer>
        </>
    )
}
