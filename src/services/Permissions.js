import { Camera } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import { BarCodeScanner } from 'expo-barcode-scanner'

export async function getCameraPermission() {
    const { status } = await Camera.requestPermissionsAsync()
    return status
}

export async function getPickerPermission() {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync()
    return status
}

export async function getBarcodePermission() {
    const { status } = await BarCodeScanner.requestPermissionsAsync()
    return status
}
