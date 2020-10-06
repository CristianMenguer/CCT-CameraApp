import React, { useEffect, useState } from 'react'
import { Text, View, Platform, StyleSheet, Image } from 'react-native'
import Constants from 'expo-constants'
import Toast from 'react-native-tiny-toast'

import { getCameraPermission, getPickerPermission, getBarcodePermission, getAudioPermission } from '../services/Permissions'

import logoImg from '../../assets/logo.jpg'

/*
* This is the home screen. In this screen, all the permissions are asked
* and some information about the app and the device are displayed on the screen
*/

const HomeScreen = () => {

    // variables that will store each permission
    const [cameraPermission, setCameraPermission] = useState(false)
    const [galleryPermission, setGalleryPermission] = useState(false)
    const [barCodePermission, setBarCodePermission] = useState(false)
    const [audioPermission, setAudioPermission] = useState(false)

    // this function will run after rendering the screen, in order to aske for the permissions
    useEffect(() => {
        //
        if (Platform.OS !== 'web') {
            getCameraPermission().then(data => {
                setCameraPermission(data === 'granted')
                //
                if (data !== 'granted')
                    Toast.show('CCT-CameraApp needs access to your camera!')
            })
            //
            getPickerPermission().then(data => {
                setGalleryPermission(data === 'granted')
                //
                if (data !== 'granted')
                    Toast.show('CCT-CameraApp needs access to your gallery!')
            })
            //
            getBarcodePermission().then(data => {
                setBarCodePermission(data === 'granted')
                //
                if (data !== 'granted')
                    Toast.show('CCT-CameraApp needs access to your barCode scanner!')
            })
            //
            getAudioPermission().then(data => {
                setAudioPermission(data === 'granted')
                //
                if (data !== 'granted')
                    Toast.show('CCT-CameraApp needs access to your audio!')
            })
        }
    }, [])

    return (
        <View style={styles.containerMaster} >
            <View style={styles.container}>
                <Image
                    source={logoImg}
                    style={styles.logo}
                />
                <Text style={styles.title} >Welcome to CameraApp</Text>
                <Text style={styles.description} >This prototype is aimed to
                test the access to the camera module functionalities
                using React Native.</Text>
                <View>
                    <Text style={styles.description} >Authors:</Text>
                    <Text style={styles.description} >Bruna Marjorie</Text>
                    <Text style={styles.description} >Cristian Menguer</Text>
                    <Text style={styles.description} >Danilo Pereira</Text>
                    <Text style={styles.description} >Liliane Santos</Text>
                </View>
                <View>
                    <Text style={styles.description} >Platform and Version: {Platform.OS} v{Platform.Version}</Text>
                    <Text style={styles.description} >Device: {Constants.deviceName}</Text>
                </View>
            </View>
        </View>
    )
}

// This variable contains all the css of this screen
const styles = StyleSheet.create({
    containerMaster: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        backgroundColor: '#F3F4F4',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: "70%",
        width: 500,
    },
    logo: {
        width: 300,
        height: 79
    },
    title: {
        fontWeight: "bold",
        fontSize: 24
    },
    description: {
        maxWidth: 250,
        textAlign: 'center'
    }
})

export default HomeScreen
