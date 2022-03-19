import React, { useEffect, useLayoutEffect, useState, useCallback } from 'react'
import { SectionList, StyleSheet, Text, View, SafeAreaView, StatusBar, Image } from 'react-native';
import { auth, db } from '../firebase';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { GiftedChat } from 'react-native-gifted-chat'


const ChatScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    var chatName = '9TESTDEMO1'
    var userName = 'test'
    // const textGroup = 'chats2'

    useEffect(() => {
        //  getData()
    })
    useLayoutEffect(() => {
        const unsubscribe = db.collection(chatName).orderBy('createdAt', 'desc').onSnapshot(snapshot => setMessages(
            snapshot.docs.map(doc => ({
                _id: doc.data()._id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user
            }))
        ))
        return () => unsubscribe;
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        const {
            _id,
            createdAt,
            text,
            user
        } = messages[0]
        db.collection(chatName).add({
            _id,
            createdAt,
            text,
            user
        })

    }, [])

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

    const ChangeName = (setUserName, setChatName) => {
        userName = setUserName
        chatName = setChatName
    }

    const getData = () => {
        var getstatus = '9TESTDEMO3'
        var APIURL = "http://treesbot.com/pepsi/select_user.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        var Data = {
            status: getstatus
        };

        fetch(APIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
            .then((Response) => Response.json())
            .then((Response) => {
                alert(Response[0].Message)
                console.log(Data);
            })
            .catch((error) => {
                alert("ERROR FOUND" + error)

                console.error("ERROR FOUND" + error);
            })

    }

    let A = [
        {
            id: '9TESTDEMO1',
            value: '9TESTDEMO1 (ร้านทดสอบ)',
            image: 'https://pepsifanclub-th.com/medias/display/2022/02/09/62031caa1c7fe.jpeg'
        },
        {
            id: '9TESTDEM2',
            value: '9TESTDEM2 (ร้านทดสอบ1)',
            image: 'https://inwfile.com/s-a/u5a32r1.jpg'
        },
        {
            id: '9TESTDEMO3',
            value: '9TESTDEMO3 (ร้านทดสอบ2)',
            image: 'https://img.freepik.com/free-photo/online-store-mobile-application_41910-429.jpg?size=626&ext=jpg'
        },
    ];

    const FlatListItemSeparator = () => {
        return (
            //Item Separator
            <View style={styles.listItemSeparatorStyle} />
        );
    };
    // onPress={() => alert(JSON.stringify(item.value))}>
    const imageSource = 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg';

    return (

        <View style={[styles.container, {
            // Try setting `flexDirection` to `"row"`.
            flexDirection: "row"
        }]}>
            <View style={{ flex: 1, backgroundColor: "write" }, styles.container}>
                <SectionList
                    ItemSeparatorComponent={FlatListItemSeparator}
                    sections={[
                        { data: A },
                    ]}
                    renderSectionHeader={({ section }) => (
                        <Text style={styles.sectionHeaderStyle}> {section.title} </Text>
                    )}
                    renderItem={({ item }) => (
                        // Single Comes here which will be repeatative for the FlatListItems
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.Img}
                            />
                            <Text
                                style={styles.sectionListItemStyle}
                                //Item Separator View
                                onPress={ChangeName(item.value, item.id)}>

                                {item.value}
                            </Text>

                        </View>
                    )}
                    keyExtractor={(item, index) => index}
                />
            </View>
            <View style={{ flex: 2, backgroundColor: "lightgray" }} >
                <View style={styles.namechats}>
                    <Text style={styles.titleText}>{userName}</Text>
                </View>
                <GiftedChat
                    messages={messages}
                    showAvatarForEveryMessage={true}
                    onSend={messages => onSend(messages)}
                    user={{
                        _id: 'Admin',
                        name: 'Admin',
                        avatar: 'https://static-s.aa-cdn.net/img/gp/20600014266053/JVWGO91AFGOSfDoqO3V_YlUiWnCoiyob0aPkVOss0qASb26aRbXvWiiNK12ZFLxfsSw=s300?v=1'
                    }}
                />
            </View>
        </View >
    )
}
export default ChatScreen

const styles = StyleSheet.create({
    Img: {
        height: 50,
        width: 50,
        borderRadius: 25
    },
    namechats: {
        /// flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 40
    },
    titleText: {
        fontSize: 18,
        padding: 5,
        color: 'black',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
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
        backgroundColor: 'white',
    },
    listItemSeparatorStyle: {
        height: 0.5,
        width: '100%',
        backgroundColor: '#C8C8C8',
    },
});

