import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';
import { Camera, CameraType } from "expo-camera";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import Button from '../src/components/Button';

export default function FotoCont() {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const [zoom, setZoom] = useState(0);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            MediaLibrary.requestPermissionsAsync();
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef) {
            try {
                const data = await cameraRef.current.takePictureAsync();
                console.log(data);
                setImage(data.uri)
            } catch (e) {
                console.log(e);
            }
        }
    }

    const saveImage = async () => {
        if (image) {
            const options = { quality: 0.7, base64: true };
            const data1 = await cameraRef.current.takePictureAsync();
            console.log(data1);
            const source = data1.base64;

            if (image) {
                await cameraRef.current.pausePreview();
                setIsPreview(true);

                let base64Img = `data:image/jpg;base64,${image}`;
                let apiUrl =
                    'http://servicios.aconcaguafoods.cl/Despacho/fotos';

                let data1 = {
                    file: base64Img,
                    upload_preset: '<your-upload-preset>'
                };

                fetch(apiUrl, {
                    body: JSON.stringify(data1),
                    headers: {
                        'content-type': 'application/json'
                    },
                    method: 'POST'
                })
                    .then(async response => {
                        let data = await response.json();
                        if (data.secure_url) {
                            alert('Foto subida !!');
                        }
                    })
                    .catch(err => {
                        alert('No se puede cargar imagen');
                    });
            }
        }
    }


    /* const saveImage = async () => {
        if (image) {
            try {
                await MediaLibrary.createAssetAsync(image);

                alert('Foto guardada! <3 ')
                setImage(null);
            } catch (e) {
                console.log(e)
            }
        }
    } */

    if (hasCameraPermission === false) {
        return <Text>No tienes acceso a la camara</Text>
    }

    const changeZoom = (event) => {
        if (event.nativeEvent.scale > 1 && zoom < 1) {
            setZoom(zoom + 0.005);
        }
        if (event.nativeEvent.scale < 1 && zoom > 0) {
            setZoom(zoom - 0.005);
        }
    };



    return (
        <View style={styles.container}>
            {!image ?
                <Camera
                    style={styles.camera}
                    type={type}
                    flashMode={flash}
                    ref={cameraRef}
                    autoFocus={Camera.Constants.AutoFocus.on}
                >
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 50,
                    }}>
                        <Button icon={'retweet'} onPress={() => {
                            setType(type === CameraType.back ? CameraType.front : CameraType.back)
                        }} />
                        <Button icon={'flash'}
                            color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#f1f1f1'}
                            onPress={() => {
                                setFlash(flash === Camera.Constants.FlashMode.off
                                    ? Camera.Constants.FlashMode.on
                                    : Camera.Constants.FlashMode.off
                                )
                            }} />
                    </View>
                </Camera>
                :
                <Image source={{ uri: image }} style={styles.camera} />
            }
            <View>
                {image ?
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 50
                    }}>
                        <Button title={'Tomar Otra'} icon="retweet" onPress={() => setImage(null)} />
                        <Button title={'Guardar'} icon="check" onPress={saveImage} />
                    </View>
                    :
                    <Button title={'Tomar Foto'} icon="camera" onPress={takePicture} />
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        paddingBottom: 20
    },
    camera: {
        flex: 1,
        borderRadius: 20,
    }
});