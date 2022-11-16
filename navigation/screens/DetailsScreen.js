import { NavigationContainer, TabActions, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { StyleSheet, View, Text, Button, TextInput, SafeAreaView } from 'react-native';
import FotoCont from '../../fotoContenedor/FotoContenedores';


const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 20,
        borderWidth: 1,
        padding: 10,
        fontSize: 22,
    },
});
const Stack = createNativeStackNavigator();
export default function DetailsScreen({ navigation }) {
    const [text, onChangeText] = React.useState("OC.");

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <SafeAreaView>
                <TextInput style={styles.input}
                    onChangeText={onChangeText}
                    value={text}></TextInput>
            </SafeAreaView>
            <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>CONTENEDORES</Text>
            <View style={{ margin: 20 }}>
                <Button onPress={() => navigation.navigate('FotoContenedores')} title='FotoContenedor' component={FotoCont} ></Button>
            </View>
        </View>
    );
}