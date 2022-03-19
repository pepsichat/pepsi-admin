import React, { useLayoutEffect } from 'react'
import { SectionList, StyleSheet, Text, View, SafeAreaView, StatusBar, Image } from 'react-native';
import { auth, db } from '../firebase';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const HistoryScreen2 = ({ navigation }) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{
                    marginRight: 30
                }}
                    onPress={signOut}
                >
                    <AntDesign name="logout" size={24}
                        color="black" />
                </TouchableOpacity>
            )
        })

    }, [])
    const signOut = () => {
        auth.signOut().then(() => {
            navigation.replace('Login')
        }).catch((error) => {
            // An error happened.
        });
    }
  
    return (
        <View style={[styles.container, {

            flexDirection: "row"
        }]}>
            <View style={{ flex: 1, backgroundColor: "write" }}>
                <View style={[{ flexDirection: "row" }]}>
                   
                    <Image
                        source={require("../assets/history.jpg")}
                        resizeMode="contain"
                        style={styles.img1}
                    ></Image>
                </View>
                <View style={[{ flexDirection: "row" }]}>
                   
                    <Image
                        source={require("../assets/history1.png")}
                        resizeMode="contain"
                        style={styles.img1}
                    ></Image>
                </View>
                <View style={[{ flexDirection: "row" }]}>
                   
                    <Image
                        source={require("../assets/history2.png")}
                        resizeMode="contain"
                        style={styles.img1}
                    ></Image>
                </View>
                <View style={[{ flexDirection: "row" }]}>
                   
                    <Image
                        source={require("../assets/history3.png")}
                        resizeMode="contain"
                        style={styles.img1}
                    ></Image>
                </View>

            </View>

            <View style={{ flex: 1, backgroundColor: "darkblue" }} >

                <View style={[{ flexDirection: "row" }]}>
                   
                    <Image
                        source={require("../assets/imagehistory2.png")}
                        resizeMode="contain"
                        style={styles.img2}
                    ></Image>
                </View>
                <View style={styles.namechats}>
                    <Text style={styles.titleText}>ประวัติการสนทนา</Text>
                </View>
                <View style={[{ flexDirection: "row" }]}>
                   
                    <Image
                        source={require("../assets/chathistory.png")}
                        resizeMode="contain"
                        style={styles.img3}
                    ></Image>
                </View>

            </View>
        </View>
    )
}
export default HistoryScreen2

const styles = StyleSheet.create({
    namechats: {
        /// flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        height: 40
    },
    titleText: {
        fontSize: 18,
        padding: 5,
        color: 'white',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',

    },
    container2: {
        /// flex: 1,
        // justifyContent: 'center',
        backgroundColor: 'white',
        height: 400,
        width: 600
    },
    sectionHeaderStyle: {
        backgroundColor: '#0089FC',
        fontSize: 20,
        padding: 5,
        color: '#fff',
    },
    sectionListItemStyle: {
        fontSize: 15,
        padding: 15,
        color: '#000',
        backgroundColor: '#F5F5F5',
    },
    listItemSeparatorStyle: {
        height: 0.5,
        width: '100%',
        backgroundColor: '#C8C8C8',
    },
    img1: {
        height: 100,
        width: 600
    },
    img2: {
        height: 200,
        width: 600
    },
    img3: {
        height: 350,
        width: 600
    },
    logo: {
        height: 30,
        width: 30,
    },
});
