import React, { useEffect } from 'react'
import { Text, View, Platform, StyleSheet, Image } from 'react-native'
import Constants from 'expo-constants'

import { getCameraPermission, getPickerPermission, getBarcodePermission, getAudioPermission } from '../services/Permissions'

import logoImg from '../../assets/logo.jpg'

const HomeScreen = () => {

    useEffect(() => {
        //
        if (Platform.OS !== 'web') {
            getCameraPermission().then(data => {
                //console.log(`getCameraPermission: ${data}`)
            })
            //
            getPickerPermission().then(data => {
                //console.log(`getPickerPermission: ${data}`)
            })
            //
            getBarcodePermission().then(data => {
                //console.log(`getBarcodePermission: ${data}`)
            })
            //
            getAudioPermission().then(data => {
                //console.log(`getAudioPermission: ${data}`)
            })
        }
    }, [])

    return (
        <View style={styles.containerMaster} >
            <View style={styles.container}>
                <Image resi
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

const styles = StyleSheet.create({
    containerMaster: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        backgroundColor: '#F3F4F4',
        // flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        height: "70%",
        width: 500,
    },
    logo: {
        // height: 120,
        // width: 455,
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
