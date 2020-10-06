import React, { useState, useEffect } from 'react'
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

const GalleryScreen = () => {

    // variable used to store the path of the selected image from the gallery
    const [selectedImage, setSelectedImage] = useState('')

    /*
    * This function opens the image picker and allows the user to select one photo
    * from the gallery. If selected, the path of the photo will be stored
    * in the variable selectedImage;
    *
    * The parameter forceLoad is used to check if, even having a photo already loaded, it will
    * ask for another one. It is necessary to avoid the app to ask for a new photo every time
    * it renders the screen and make sure it will open the image picker when the button is pressed
    */
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

    // It will call the function every time the screen is rendered
    useEffect(() => {

        loadImage()

    }, [])

    return (
        <View style={styles.container} >
            <View style={styles.containerImage} >
                {/* The image will only be shown if the path is set */}
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
