import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { Camera } from 'expo-camera'
import { Video } from 'expo-av'
import * as FaceDetector from 'expo-face-detector'
import * as MediaLibrary from 'expo-media-library'
import Toast from 'react-native-tiny-toast'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


const PhotoScreen = (navProps) => {

    const [cameraRef, setCameraRef] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type.back)
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.on) //torch, on, off
    const [photoPath, setPhotoPath] = useState('')
    const [videoPath, setVideoPath] = useState('')
    const [isRecording, setRecording] = useState(false)
    const [timerFace, setTimerFace] = useState(0)
    const [scanned, setScanned] = useState(false)
    const [barCode, setBarCode] = useState('')
    const [barType, setBarType] = useState('')
    const [faces, setFaces] = useState([])

    function handleFaceDetected(props) {
        let auxFaces = props.faces

        for (let i = 0; i < auxFaces.length; i++)
            auxFaces[i].ID = i + 1
        //
        setFaces(auxFaces)
        //
        if (!!faces && faces.length > 0) {
            //
            if (timerFace > 0)
                clearTimeout(timerFace)

            const timerID = setTimeout(() => setFaces({}), 200)
            if (timerID > 0)
                setTimerFace(timerID)
            //
        }
    }

    async function handleTakePicture() {

        if (cameraRef) {

            const { uri } = await cameraRef.takePictureAsync()

            const asset = await MediaLibrary.createAssetAsync(uri)

            MediaLibrary.createAlbumAsync('CCT-CameraApp', asset)
                .then(() => {
                    Toast.show('Photo saved in the gallery!')
                })
                .catch(error => {
                    console.log('err', error)
                })

            setPhotoPath(uri)

            setTimeout(() => { setPhotoPath('') }, 3000)
        }
    }

    function handlePressOut() {

        setRecording(false)

        if (cameraRef && isRecording) {

            log('Releasing the button after recording video')
            cameraRef.stopRecording()
        }
    }

    async function handleVideo() {

        if (cameraRef) {

            setRecording(true)

            cameraRef.recordAsync()
                .then(async (data) => {

                    const asset = await MediaLibrary.createAssetAsync(data.uri)
                    MediaLibrary.createAlbumAsync('CCT-CameraApp', asset, false)
                        .then(() => {
                            log('Video saved in the gallery!')
                        })
                        .catch(error => {
                            console.log('err', error)
                        })
                    //
                    setVideoPath(data.uri)

                    setTimeout(() => { setVideoPath('') }, 3000)
                })
        }
    }

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true)
        setBarCode(data)
        setBarType(type)
    }

    function log(message) {
        Toast.show(message)
        console.log(message)
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
                    style={styles.thumbnail}
                />
            }

            {scanned &&
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }} >
                    <Text>Code:  {barCode}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setScanned(false)
                            setBarCode('')
                            setBarType('')
                        }}
                        style={styles.button} >
                        <Text style={{ color: '#FFF' }} >Back to Camera</Text>
                    </TouchableOpacity>
                </View>
            }



            {photoPath === '' && videoPath === '' && !scanned &&

                <Camera
                    style={{ flex: 1 }}
                    type={type} ref={ref => {
                        setCameraRef(ref)
                    }}
                    flashMode={flash} //torch, on, off
                    autoFocus={Camera.Constants.AutoFocus.on}
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    onFacesDetected={handleFaceDetected}
                    faceDetectorSettings={{
                        mode: FaceDetector.Constants.Mode.fast,
                        detectLandmarks: FaceDetector.Constants.Landmarks.none,
                        runClassifications: FaceDetector.Constants.Classifications.none
                    }}
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

                            <Icon name='camera-party-mode' color='white' size={32}/>
                        </TouchableOpacity>

                            <TouchableOpacity

                                onPress={() => {

                                    setFlash(
                                        flash === Camera.Constants.FlashMode.on
                                            ? Camera.Constants.FlashMode.off
                                            : Camera.Constants.FlashMode.on
                                    );

                                }}
                                >
                                {flash === Camera.Constants.FlashMode.on ?
                                    <Icon name='flash' color='white' size={32}/>

                                    :

                                    <Icon name='flash-off' color='white' size={32}/>
                                }

                            </TouchableOpacity>

                        {faces[0] && faces.map(face => (

                            <View key={face.ID} style={
                                {
                                    position: 'absolute',
                                    top: face.bounds.origin.y,
                                    left: face.bounds.origin.x,
                                    height: face.bounds.size.height,
                                    width: face.bounds.size.width,
                                    //backgroundColor: 'white',
                                    opacity: 0.5,
                                    borderColor: 'yellow',
                                    borderWidth: 8,
                                    borderRadius: 20,
                                }
                            } />
                        ))}

                        <TouchableOpacity
                            activeOpacity={0.4}
                            style={{
                                alignSelf: 'center',
                                marginBottom: 8
                            }}
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
        resizeMode: "contain"
    },
    button: {
        backgroundColor: '#e91e63',
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        height: 64,
        width: '50%',
        marginVertical: 16,
    }

})

export default PhotoScreen
