import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity, Platform } from 'react-native'
import Constants from 'expo-constants'

import { getCameraPermission, getPickerPermission, getBarcodePermission } from '../services/Permissions'

const HomeScreen = () => {
    const [isPermissionGranted, setPermissionGranted] = useState(false)

    const createButtonAlert = () => {
        Alert.alert(
            "Permission Denied",
            "Please, give permission to use the camera",
            [
                {
                    text: "Not now",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
        )
    }

    useEffect(() => {
        getCameraPermission().then(data => {
            //console.log(`getCameraPermission: ${data}`)
            // setPermissionGranted(data)
        })
        //
        getPickerPermission().then(data => {
            //console.log(`getPickerPermission: ${data}`)
        })
        //
        getBarcodePermission().then(data => {
            //console.log(`getPickerPermission: ${data}`)
            setPermissionGranted(data)
        })
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home</Text>
            <Text>Platform and Version: {Platform.OS} v{Platform.Version}</Text>
            <Text>Device: {Constants.deviceName}</Text>
            {!isPermissionGranted && <TouchableOpacity onPress={createButtonAlert} >
                <Text>Get Permission</Text>
            </TouchableOpacity>}
        </View>
    )
}

export default HomeScreen
