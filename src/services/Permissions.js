import { Camera } from 'expo-camera'
import { Audio } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import { BarCodeScanner } from 'expo-barcode-scanner'

/*
 * In this file all the permissions that are necessary to the app are asked/checked
*/

// Camera permission
export async function getCameraPermission() {
    const { status } = await Camera.requestPermissionsAsync()
    return status
}

// Audio permission, necessary to record videos
export async function getAudioPermission() {
    const { status } = await Audio.requestPermissionsAsync()
    return status
}

// ImagePicker permission, used to pick an image from the gallery
export async function getPickerPermission() {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync()
    return status
}

// Barcode permission
export async function getBarcodePermission() {
    const { status } = await BarCodeScanner.requestPermissionsAsync()
    return status
}
