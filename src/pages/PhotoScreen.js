import React, { useState } from 'react'
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { Camera } from 'expo-camera'
import { Video } from 'expo-av'
import * as FaceDetector from 'expo-face-detector'
import * as MediaLibrary from 'expo-media-library'


const PhotoScreen = () => {

    const [cameraRef, setCameraRef] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type.back)
    const [photoPath, setPhotoPath] = useState('')
    const [videoPath, setVideoPath] = useState('')
    const [isFaceDetected, setFaceDetected] = useState(false)
    const [timerFace, setTimerFace] = useState(0)
    const [scanned, setScanned] = useState(false)
    const [barCode, setBarCode] = useState('')
    const [videoRecorded, setVideoRecorded] = useState({})

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

            console.log('photo')
            const options = { quality: 1, base64: true, exif: true }
            const photo = await cameraRef.takePictureAsync()

            setPhotoPath(photo.uri)

            MediaLibrary.saveToLibraryAsync(photo.uri)

            setTimeout(() => { setPhotoPath('') }, 3000)
        }
    }

    function handlePressOut() {

        if (cameraRef) {

            console.log('pressout')
            cameraRef.stopRecording()

            setVideoPath(videoRecorded.uri)

            MediaLibrary.saveToLibraryAsync(videoRecorded.uri)

            setVideoRecorded({})

            setTimeout(() => { setVideoPath('') }, 3000)
        }
    }

    async function handleVideo() {

        if (cameraRef) {

            console.log('video')
            cameraRef.recordAsync().then(data => {
                setVideoRecorded(data)
            })
            console.log('after starting video')
        }
    }

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true)
        setBarCode(data)
    }

    return (
        <View style={{ flex: 1 }}>

            {photoPath !== '' &&
                <Image
                    source={{ uri: photoPath }}
                    style={styles.thumbnail}
                />
            }

            {videoPath !== '' &&
                <Video
                    source={{ uri: videoPath }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay
                    isLooping
                    style={{ width: 300, height: 300 }}
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

            {photoPath === '' && videoPath === '' && !scanned &&
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
                        <TouchableOpacity
                            activeOpacity={0.4}
                            style={{ alignSelf: 'center' }}
                            onPress={handleTakePicture}
                            delayLongPress={700}
                            onLongPress={handleVideo}
                            onPressOut={handlePressOut}
                        >
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
