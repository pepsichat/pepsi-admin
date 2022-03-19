import React, { useEffect, useLayoutEffect, useState, useCallback } from 'react'
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { auth, db } from '../firebase';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GiftedChat } from 'react-native-gifted-chat';

const TeatList = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [messages, setMessages] = useState([]);

    async function readUser() {
        const unsubscribe = db.collection('9TESTDEMO1').orderBy('createdAt', 'desc').onSnapshot(snapshot => setMessages(
            snapshot.docs.map(doc => ({
                _id: doc.data()._id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user
            }))
        ))
        return () => unsubscribe;
    }

    useEffect(() => {
        readUser()
    }, [])

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Hello World!</Text>
                        <GiftedChat
                            messages={messages}
                            showAvatarForEveryMessage={true}
                            user={{
                                _id: 'Admin',
                                name: 'Admin',
                                avatar: 'https://static-s.aa-cdn.net/img/gp/20600014266053/JVWGO91AFGOSfDoqO3V_YlUiWnCoiyob0aPkVOss0qASb26aRbXvWiiNK12ZFLxfsSw=s300?v=1'
                            }}
                            renderInputToolbar={() => { return null }}
                        />
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.textStyle}>Show Modal</Text>
            </Pressable>
       </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        width:500,
        height:500,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default TeatList;
