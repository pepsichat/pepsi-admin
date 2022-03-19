import React, { useEffect, useLayoutEffect, useState, useCallback } from 'react'
import { SectionList, StyleSheet, Text, View, Image, Button } from 'react-native';
import { auth, db } from "../firebase";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
///import LoginScreen from './screens/LoginScreen';

const MainMenuScreen = ({ navigation }) => {

    const [count, setCount] = useState(3);
    const [countNoti, setCountNoti] = useState(0);
    const [countColorBG, setCountColorBG] = useState('darkblue');
    const [countColorTXT, setCountColorTXT] = useState('darkblue');

    useEffect(() => {
        // increment the count by 1
        const countTimer = setInterval(() => {
            manageTimer();
            // every 1000 milliseconds
        }, 1000);
        // and clear this timer when the component is unmounted
        return function cleanup() {
            clearInterval(countTimer);
        };
    });

    const manageTimer = async () => {

        if (count == 0) {
            // alert('Times Up !\nTimer  is reset')
            console.log('Times Up')
            // clearInterval(timer)
            // setCount(5)
        } else if (count == 1) {
            selectChatLog()
        } else {
            setCount(count - 1)
        }
    }

    const selectChatLog = async () => {
        try {
            const response = await fetch('https://school.treesbot.com/pepsichat/select_chat_log_noti_admin.php')
            const json = await response.json()
            setCountNoti(json[0].chatcount);
            setCountColorBG(json[0].chatcolorbg);
            setCountColorTXT(json[0].chatcolortxt);
            setCount(3)
            //  onPressTitle(json[0].shopname, json[0].shopcode, json[0].chatname, json[0].menu)
        } catch (error) {
            console.error(error)
            setCount(3)
        }

    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{
                        marginRight: 30,
                    }}
                    onPress={signOut}
                >
                    <AntDesign name="logout" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, []);
    const signOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login");
            })
            .catch((error) => {
                // An error happened.
            });
    };
    return (
        <View
            style={[
                styles.container,
                {
                    flexDirection: "row",
                },
            ]}
        >
            <View style={{ flex: 1, backgroundColor: "darkblue" }}>
                    <View
                        style={[
                            {
                                flexDirection: "row",
                            },
                        ]}
                    >
                        <View>
                            <Image
                                source={require("../assets/Pepsi-Logo.png")}
                                resizeMode="contain"
                                style={styles.logo1}
                            ></Image>
                        </View>
                        <View>
                            <Text style={styles.titleText}>
                                
                                {"Admin"}
                            </Text>
                        </View>
                    </View>
                    
                <View>
                    <Text style={styles.titleText}>
                        {"Welcome"}
                    </Text>
                    <Text style={styles.titleText}>
                        {"Mission/Quest"}
                    </Text>
                    <Text style={styles.titleText}>
                        {"What's News"}
                    </Text>
                    <Text style={styles.titleText}>
                        {"Check-In"}
                    </Text>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={styles.titleText} onPress={() => navigation.navigate('Menu')}>
                            {"Live Chat"}
                        </Text>
                        <Text
                            style={{
                                marginLeft: 20,
                                textAlign: 'center',
                                backgroundColor: countColorBG,
                                fontSize: 10,
                                padding: 5,
                                marginTop: 5,
                                color: countColorTXT,
                                height: 20,
                                width: 20,
                                borderRadius: 10
                            }}>
                            {countNoti}
                        </Text>
                    </View>

                    <Text style={styles.titleText}>
                        {"Score Results"}
                    </Text>
                    <Text style={styles.titleText}>
                        {"Rewards & Redreem"}
                    </Text>
                    <Text style={styles.titleText}>
                        {"Report"}
                    </Text>
                    <Text style={styles.titleText}>
                        {"Setting"}
                    </Text>
                    <Text style={styles.titleText}>
                        {"Logout"}
                    </Text></View>
                    
            </View>

            <View style={{ flex: 3, backgroundColor: "write" }}>


                <View >
                    
                    <Image
                        source={require("../assets/checkin.jpg")}
                        resizeMode="contain"
                        style={styles.img2}
                    ></Image>
                </View>
            </View>
        </View>
    );
};
export default MainMenuScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
    },
    sectionHeaderStyle: {
        backgroundColor: "#0089FC",
        fontSize: 20,
        padding: 5,
        color: "#fff",
    },
    sectionListItemStyle: {
        fontSize: 15,
        padding: 15,
        color: "#000",
        backgroundColor: "#F5F5F5",
    },
    listItemSeparatorStyle: {
        height: 0.5,
        width: "100%",
        backgroundColor: "#C8C8C8",
    },
    img1: {
        height: 350,
        width: 700,
    },
    img2: {
        height: 300,
        width: 900,
        justifyContent: "center",
    },

    titleText: {
        fontSize: 20,
        color: "#fff",
        //fontWeight: "bold",
        justifyContent: "center",
    },
    containerText: {
        flex: 1,
        justifyContent: "center",
    },
    logo1: {
        height: 70,
        width: 70,
    },
});