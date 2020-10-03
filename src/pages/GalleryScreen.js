import React, { useState, useEffect } from 'react'
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

const GalleryScreen = () => {

    const [selectedImage, setSelectedImage] = useState('')

    useEffect(() => {

        async function loadImage() {
            if (selectedImage !== '')
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
        //
        loadImage()

    }, [selectedImage])

    return (
        <View style={styles.container} >
            {selectedImage === '' ?
                <Text style={styles.text} >Waiting...</Text>
                :
                <Image
                    style={styles.image}
                    source={{ uri: selectedImage }}
                />
            }
            <TouchableOpacity style={styles.button} onPress={() => setSelectedImage('')} >
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
    }
})

export default GalleryScreen
