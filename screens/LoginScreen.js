import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Input, Button } from 'react-native-elements';
import { auth } from '../firebase';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const signIn = () => {
      //  auth.signInWithEmailAndPassword(email, password)
        auth.signInWithEmailAndPassword('fon@init.co.th', '123456')
            .catch((error) => {
                var errorMessage = error.message;
                alert(errorMessage)
            });
    }
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                var uid = user.uid;
                navigation.navigate('Main');
            } else {
                // User is signed out
                navigation.canGoBack() && navigation.popToTop();
            }
        });
        return unsubscribe
    }, [])
    return (
        <View style={style.container}>
            <Image
                source={require("../assets/Pepsi-Logo.png")}
                resizeMode="contain"
                style={style.logo1}
            ></Image>
            <View style={style.containercenter}>
                <Input
                    //placeholder="Enter your email"
                    style={style.textview}
                    label="Username"
                    // leftIcon={{ type: 'material', name: 'email'}}
                    value={email}
                    onChangeText={text => setEmail(text)}
                />

                <Input
                    // placeholder="Enter your password"
                    style={style.textview}
                    label="Password"
                    // leftIcon={{ type: 'material', name: 'lock'}}
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
                <Button
                    title="เข้าสู่ระบบ"
                    style={style.button}
                    onPress={signIn}
                />
            </View>
        </View>
    )
}
export default LoginScreen
const style = StyleSheet.create({
    logo1: {
        height: 150,
        width: 220
    },
    button: {
        width: 200,
        marginTop: 10
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "rgba(0,102,204,1)",
        //padding: 10
    },
    containercenter: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "rgba(0,102,204,1)",
        padding: 10
    },
    textview: {
        backgroundColor: "rgba(255,255,255,1)"
    },

})