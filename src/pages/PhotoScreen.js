import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native'
import { Camera } from 'expo-camera'
import { Video } from 'expo-av'
import * as FaceDetector from 'expo-face-detector'
import * as MediaLibrary from 'expo-media-library'
import Toast from 'react-native-tiny-toast'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


const PhotoScreen = () => {

    const [cameraRef, setCameraRef] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type.back)
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.on) //torch, on, off
    const [photoPath, setPhotoPath] = useState('')
    const [videoPath, setVideoPath] = useState('')
    const [isRecording, setRecording] = useState(false)
    const [scanned, setScanned] = useState(false)
    const [barCode, setBarCode] = useState('')
    const [barType, setBarType] = useState('')
    const [faces, setFaces] = useState([])

    /* When a face is detected by the camera, this function is called.
     * It adds an ID to each object (face detected) and then set the variable faces.
     */
    function handleFaceDetected(props) {
        let auxFaces = props.faces
        //
        if (auxFaces.length > 0) {
            //
            for (let i = 0; i < auxFaces.length; i++)
                auxFaces[i].ID = i + 1
            //
            setFaces(auxFaces)
        } else {
            setFaces({})
        }
    }

    /* This function is called when the shutter button is pressed.
     * Once it is pressed, the photo will be saved and displayed on the screen for 3s.
     */
    async function handleTakePicture() {
        //
        if (cameraRef) {
            const { uri } = await cameraRef.takePictureAsync()
            const asset = await MediaLibrary.createAssetAsync(uri)
            //
            MediaLibrary.createAlbumAsync('CCT-CameraApp', asset)
                .then(() => {
                    log('Photo saved in the gallery!')
                })
                .catch(error => {
                    console.log('err', error)
                })
            //
            setPhotoPath(uri)
            setTimeout(() => { setPhotoPath('') }, 3000)
            //
        }
    }

    /* This function will check if it is recording. If it is, the recording will be ended.
    */
    function handlePressOut() {
        if (cameraRef && isRecording) {
            setRecording(false)
            cameraRef.stopRecording()
        }
    }

    /* This function is called when the shutter button is pressed for at least 700 ms (long press).
     * It will start recording a video and, when the button is released, it stops recording and
     * the video is saved in the gallery, being shown on screen for quick preview (3s).
     */
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

    /* When a barcode/qrcode is read, this function is called.
     * It sets the code read and a flag that is used to show the code in the screen.
     */
    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true)
        setBarCode(data)
        setBarType(type)
    }

    /* This function will show a message in the console (development purpose only)
    * and also a toast message in the device
    */
    function log(message) {
        Toast.show(message)
        console.log(message)
    }


    return (
        <View style={styles.container} >


            {
                // It shows the image only if its path is set
                photoPath !== '' &&
                <Image
                    source={{ uri: photoPath }}
                    style={styles.mediaOnScreen}
                />
            }

            {
                // It shows the video only if its path is set
                videoPath !== '' &&
                <Video
                    source={{ uri: videoPath }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay
                    isLooping={true}
                    style={styles.mediaOnScreen}
                />
            }

            {
                // It shows the barcode/qrcode only if it is set
                scanned &&
                <View style={styles.barcode} >
                    <Text>Code:  {barCode}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setScanned(false)
                            setBarCode('')
                            setBarType('')
                        }}
                        style={styles.button} >
                        <Text style={styles.buttonText} >Back to Camera</Text>
                    </TouchableOpacity>
                </View>
            }

            {
                // It shows the camera only if none of the statements above are true
                photoPath === '' && videoPath === '' && !scanned &&

                // This is the main component in the app, the Camera. In this component a few things are set,
                // such as flash, autofocus, how the face detection works and which function should be run
                // in each situation (barcode/qrcode read or face detected)
                <Camera
                    style={styles.camera}
                    type={type} ref={ref => {
                        setCameraRef(ref)
                    }}
                    flashMode={flash} //torch, on, off
                    autoFocus={Camera.Constants.AutoFocus.on}
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    onFacesDetected={handleFaceDetected}
                    faceDetectorSettings={{
                        mode: FaceDetector.Constants.Mode.fast, // fast, accurate
                        detectLandmarks: FaceDetector.Constants.Landmarks.none,
                        runClassifications: FaceDetector.Constants.Classifications.none
                    }}
                >

                    <View
                        style={styles.cameraView}>
                        {
                            // This button changes the camera between back and selfie camera
                        }
                        <TouchableOpacity
                            style={styles.buttonFlip}
                            onPress={() => {
                                setType(
                                    type === Camera.Constants.Type.back
                                        ? Camera.Constants.Type.front
                                        : Camera.Constants.Type.back
                                );
                            }}>
                            <Icon name='camera-party-mode' color='white' size={32} />
                        </TouchableOpacity>

                        {
                            // This button changes the flash between on and off
                        }
                        <TouchableOpacity
                            style={styles.buttonFlash}
                            onPress={() => {
                                setFlash(
                                    flash === Camera.Constants.FlashMode.on
                                        ? Camera.Constants.FlashMode.off
                                        : Camera.Constants.FlashMode.on
                                );

                            }}
                        >
                            {
                                // Conditional to set the flash icon between on and off
                                flash === Camera.Constants.FlashMode.on ?
                                    <Icon name='flash' color='white' size={32} />
                                    :
                                    <Icon name='flash-off' color='white' size={32} />
                            }

                        </TouchableOpacity>

                        {
                            // The faces detected by the camera are stored in the array faces.
                            // If there is at least one face detected, the view below is shown.
                            //
                            // Method map used as a loop to make sure all faces in the array will be shown.
                            // A square is drawn around each face detected

                            faces[0] &&
                            faces.map(face => (
                                <View key={face.ID} style={styles.faceDetected(face)} />
                            ))}

                        {
                            // This is the shutter button. The same button is used for photo and video,
                            // the difference is that a single press will take a pictire and a long one will start
                            // recording until the button is released;
                        }
                        <TouchableOpacity
                            activeOpacity={0.4}
                            style={styles.shutterButton}
                            onPress={handleTakePicture}
                            delayLongPress={700}
                            onLongPress={handleVideo}
                            onPressOut={handlePressOut}
                        >
                            <View style={styles.shutterButtonOuter} >
                                <View style={styles.shutterButtonInner} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </Camera>}
        </View>
    )

}

// This variable contains all the css of this screen
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    cameraView: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end'
    },
    mediaOnScreen: {
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
    },
    buttonText: {
        color: '#FFF',
    },
    buttonFlip: {
        position: 'absolute',
        marginBottom: 8,
        top: Dimensions.get('window').height - 100,
        left: Dimensions.get('window').width - 72,
    },
    buttonFlash: {
        position: 'absolute',
        marginBottom: 8,
        top: Dimensions.get('window').height - 100,
        left: 32,
    },
    faceDetected(face) {
        return {
            position: 'absolute',
            opacity: 0.5,
            borderColor: 'yellow',
            borderWidth: 8,
            borderRadius: 20,
            top: face.bounds.origin.y,
            left: face.bounds.origin.x,
            height: face.bounds.size.height,
            width: face.bounds.size.width,
        }
    },
    shutterButton: {
        alignSelf: 'center',
        marginBottom: 8,
    },
    shutterButtonOuter: {
        borderWidth: 2,
        borderRadius: 50,
        borderColor: 'white',
        height: 50,
        width: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    shutterButtonInner: {
        borderWidth: 2,
        borderRadius: 50,
        borderColor: 'white',
        height: 40,
        width: 40,
        backgroundColor: 'white'
    },
    barcode: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default PhotoScreen
