import React, { useState, useEffect } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'

const GalleryScreen = () => {

    const [selectedImage, setSelectedImage] = useState(null)

    useEffect(() => {

        ImagePicker.launchImageLibraryAsync().then(pickerResult => {
            if (pickerResult.cancelled === true) {
                setSelectedImage(null)
                return
            }

            setSelectedImage({ localUri: pickerResult.uri })
            setSelectedImage({ localUri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FCCT-CameraApp-377e9ae6-a1f5-4486-b92a-9ed64d9ff0cd/Camera/5a232aa5-2715-4128-a80d-882d39f650bd.jpg'})
        })

    }, [])

    if (selectedImage !== null) {
        return (
            <View style={styles.container}>
                <Image
                    source={{ uri: selectedImage.localUri }}
                    style={styles.thumbnail}
                />
            </View>
            // <Text>Image</Text>
        )
    }

    return (
        <View style={styles.container}>
        </View>
        // <Text>Null</Text>
    )
}

const styles = StyleSheet.create({
    thumbnail: {
        width: 300,
        height: 300,
        resizeMode: "contain"
    }
})

export default GalleryScreen
