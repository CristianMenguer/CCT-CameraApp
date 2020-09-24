import React, { useState } from 'react'
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { Camera } from 'expo-camera'
import * as FaceDetector from 'expo-face-detector'
import { BarCodeScanner } from 'expo-barcode-scanner'


const PhotoScreen = () => {

    const [cameraRef, setCameraRef] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type.back)
    const [filePath, setFilePath] = useState('')
    const [isFaceDetected, setFaceDetected] = useState(false)
    const [timerFace, setTimerFace] = useState(0)
    const [scanned, setScanned] = useState(false)
    const [barCode, setBarCode] = useState('')

    function handleFaceDetected({ faces }) {
        // if (faces != null && faces != 'undefined' && faces.length)
        {
            if (!!faces && faces.length > 0) {
                // console.log(faces)
                setFaceDetected(true)

                if (timerFace > 0)
                    clearTimeout(timerFace)

                const timerID = setTimeout(() => setFaceDetected(false), 200)
                if (timerID > 0)
                    setTimerFace(timerID)
                //
            }
        }

    }

    async function handleTakePicture() {

        if (cameraRef) {

            const options = { quality: 1, base64: true, exif: true }
            const photo = await cameraRef.takePictureAsync()

            setFilePath(photo.uri)

            setTimeout(() => { setFilePath('') }, 3000)
        }
    }

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true)
        setBarCode(data)
    }

    return (
        <View style={{ flex: 1 }}>

            {filePath !== '' &&
                <Image
                    source={{ uri: filePath }}
                    style={styles.thumbnail}
                />
            }

            {scanned &&
                <TouchableOpacity onPress={() => {
                    setScanned(false)
                    setBarCode('')
                }} style={
                    { flex: 1, justifyContent: "center", alignItems: "center" }
                } >
                    <Text>Code: {barCode}</Text>
                    <Text>Tap to Scan Again</Text>
                </TouchableOpacity>
            }

            {filePath === '' && !scanned &&
                <Camera
                    style={{ flex: 1 }}
                    type={type} ref={ref => {
                        setCameraRef(ref)
                    }}
                    flashMode={Camera.Constants.FlashMode.off} //torch, on
                    autoFocus={Camera.Constants.AutoFocus.on}
                    onFacesDetected={handleFaceDetected}
                    faceDetectorSettings={{
                        mode: FaceDetector.Constants.Mode.fast,
                        detectLandmarks: FaceDetector.Constants.Landmarks.none,
                        runClassifications: FaceDetector.Constants.Classifications.none
                    }}
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                >

                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            justifyContent: 'flex-end'
                        }}>
                        <TouchableOpacity
                            style={{
                                flex: 0.1,
                                alignSelf: 'flex-end'
                            }}
                            onPress={() => {
                                setType(
                                    type === Camera.Constants.Type.back
                                        ? Camera.Constants.Type.front
                                        : Camera.Constants.Type.back
                                );
                            }}>
                            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
                        </TouchableOpacity>

                        {isFaceDetected && <Text style={{ fontSize: 18, marginBottom: 150, color: 'white' }}>Face Detected</Text>}
                        <TouchableOpacity style={{ alignSelf: 'center' }} onPress={handleTakePicture}>
                            <View style={{
                                borderWidth: 2,
                                borderRadius: 50,
                                borderColor: 'white',
                                height: 50,
                                width: 50,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            >
                                <View style={{
                                    borderWidth: 2,
                                    borderRadius: 50,
                                    borderColor: 'white',
                                    height: 40,
                                    width: 40,
                                    backgroundColor: 'white'
                                }} >
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Camera>}
        </View>
    )


}

const styles = StyleSheet.create({
    thumbnail: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        width: 300,
        height: 300,
        resizeMode: "contain"
    }
})

export default PhotoScreen
