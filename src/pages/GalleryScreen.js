import React, { useState, useEffect } from 'react'
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

const GalleryScreen = () => {

    const [selectedImage, setSelectedImage] = useState('')

    async function loadImage(forceLoad = false) {

        if (!forceLoad && selectedImage !== '')
            return
        //
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        })
        //
        if (cancelled === true) {
            setSelectedImage('')
        } else {
            setSelectedImage(uri)
        }
    }

    useEffect(() => {

        loadImage()

    }, [])

    return (
        <View style={styles.container} >
            <View style={styles.containerImage} >
                {selectedImage !== '' &&

                    <Image
                        style={styles.image}
                        source={{ uri: selectedImage }}
                    />
                }
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => loadImage(true)} >
                <Text style={styles.text} >Select Picture</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginHorizontal: 16,
        marginTop: 24,

    },
    containerImage: {
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
    },
    button: {
        alignSelf: 'center',
        backgroundColor: '#e91e63',
        borderRadius: 20,
        height: 64,
        width: '50%',
        marginVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',

    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#FFF'
    },
})

export default GalleryScreen
