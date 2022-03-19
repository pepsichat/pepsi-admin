import React, { useEffect, useLayoutEffect, useState, useCallback } from 'react'
import { SectionList, StyleSheet, Text, View, Image, Button } from 'react-native';
import { auth, db } from '../firebase';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GiftedChat } from 'react-native-gifted-chat';
import { SearchBar } from 'react-native-elements';

const ChatScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([]);
    const [titleText, setTitleText] = useState("");
    const [shopCodeText, setShopCodeText] = useState("");
    const [chatText, setChatText] = useState("");
    const [menuText, setMenuText] = useState("");

    const [count, setCount] = useState(3);

    var shopCode = ''
    var chatName = ''
    var menuChat = ''
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);

    const getUser = async () => {
        try {
            const response = await fetch('https://school.treesbot.com/pepsichat/select_user_and_log.php')
            const json = await response.json()
            setFilteredDataSource(json);
            setMasterDataSource(json);
            onPressTitle(json[0].shopname, json[0].shopcode, json[0].chatname, json[0].menu)
        } catch (error) {
            console.error(error)
        }
    }

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
            setCount(0)
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = masterDataSource.filter(function (item) {
                const itemData = item.shopcode
                    ? item.shopcode.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSource(newData);
            setSearch(text);
        } else {
            setCount(3)
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredDataSource(masterDataSource);
            setSearch(text);
        }
    };

    const updateChat = async (getchatText) => {
        var Data = {
            chatname: getchatText,
            status: 'no'
        };
        try {
            const response = await fetch('https://school.treesbot.com/pepsichat/close_chat.php', {
                method: 'POST',
                body: JSON.stringify(Data)
            })
            const json = await response.json()
            if (json[0].Message == 'Complete'){
                getUser()
            }
           // alert(json[0].Message)
        } catch (error) {
            alert(error)
            console.error(error)
        }
    }
    
    const insertChatLog = async (getchatText, getmenuChat) => {
       // alert("chatName" + chatName + '  shopCode ' + shopCode + ' menu ' + menuChat)
        var Data = {
            shopcode: 'admin',
            chatname: getchatText,
            menu: getmenuChat,
            status: 'unread'
        };
        try {
            const response = await fetch('https://school.treesbot.com/pepsichat/insert_chat_log.php', {
                method: 'POST',
                body: JSON.stringify(Data)
            })
            const json = await response.json()
            if (json[0].Message == 'Complete') {
              //  getUser()
            }
            // alert(json[0].Message)
        } catch (error) {
         //   alert(error)
            console.error(error)
        }
    }

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
        }else if(count == 1) {
            selectChatLog()
        } else {
            setCount(count - 1)
        }
    }

    const selectChatLog = async () => {
        try {
            const response = await fetch('https://school.treesbot.com/pepsichat/select_user_and_log.php')
            const json = await response.json()
            setFilteredDataSource(json);
            setMasterDataSource(json);
            setCount(3)
          //  onPressTitle(json[0].shopname, json[0].shopcode, json[0].chatname, json[0].menu)
        } catch (error) {
            console.error(error)
            setCount(3)
        }

    }


    const submit = async (getchatText) => {
        const res = window.confirm("ยืนยันปิดการสนทนา " + titleText);
        console.log("res", res);

        if (res) {
            // show your message success
            updateChat(getchatText)
        }
    }


    const onSend = useCallback((messages = [], getchatText, getmenuChat) => {
        //alert("chatName" + chatName + '  shopCode ' + shopCode + ' menu ' + menuChat)
      //  alert("chatText " + chatText)
        insertChatLog(getchatText, getmenuChat)
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        const {
            _id,
            createdAt,
            text,
            user
        } = messages[0]
        db.collection(getchatText).add({
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

    const updateChatLog = async (shopname, shopcode, chatname, menu) => {
      //  alert(shopcode + " " + chatname)
        var Data = {
            shopcode: shopcode,
            chatname: chatname,
            status: 'read'
        };
        try {
            const response = await fetch('https://school.treesbot.com/pepsichat/update_chat_log_web.php', {
                method: 'POST',
                body: JSON.stringify(Data)
            })
            const json = await response.json()
            //  console.log("ddd ============ " + json[0].Message)
              //  alert("ddd ============ " + json[0].Message)
        } catch (error) {
          //   alert(error)
            console.error(error)
        }
        onPressTitle(shopname, shopcode, chatname, menu) 

    }

    const onPressTitle = (shopname, shopcode, chatname, menu) => {
        chatName = chatname;
        shopCode = shopcode;
        menuChat = menu;
        let getTitle = shopcode + ' (' + shopname + ')'

        setTitleText(getTitle);
        setChatText(chatName);
        setShopCodeText(shopCode);
        setMenuText(menuChat);
    
        readUser(chatName)
    };

    const appendMessages = useCallback(
        (messages) => {
            setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
        },
        [messages]
    )

    const readUser = async (getchatName) => {
        const unsubscribe = db.collection(getchatName).onSnapshot((querySnapshot) => {
            const messagesFirestore = querySnapshot
                .docChanges()
                .filter(({ type }) => type === 'added')
                .map(({ doc }) => {
                    const message = doc.data()
                    //createdAt is firebase.firestore.Timestamp instance
                    //https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
                    return { ...message, createdAt: message.createdAt.toDate() }
                })
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            appendMessages(messagesFirestore)
        })
        return () => unsubscribe()
    }
  
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
                <SearchBar
                    lightTheme
                    round
                    searchIcon={{ size: 24 }}
                    onChangeText={(text) => searchFilterFunction(text)}
                    onClear={(text) => searchFilterFunction('')}
                    placeholder="ค้นหาจากรหัสร้านค้า..."
                    value={search}
                />

                <SectionList
                    ItemSeparatorComponent={FlatListItemSeparator}
                    sections={[
                        { data: filteredDataSource },
                    ]}
                    renderItem={({ item }) => (
                        // Single Comes here which will be repeatative for the FlatListItems
                        <View style={{ flex: 1, flexDirection: 'row', marginLeft: 20 }}>
                            <Image
                                source={{ uri: item.displayimage }}
                                style={styles.Img}
                            />
                            <Text
                                style={styles.sectionListItemStyle}
                                //Item Separator View
                                onPress={() => updateChatLog(item.shopname, item.shopcode, item.chatname, item.menu)}>

                                {item.shopcode} ({item.shopname})
                            </Text>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    backgroundColor: item.chatcolor,
                                    fontSize: 10,
                                    padding: 5,
                                    marginTop: 5,
                                    color: '#fff',
                                    height: 20,
                                    width: 20,
                                    borderRadius: 10
                                }}>
                                {item.chatcount}
                            </Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index}
                />
            </View>
            <View style={{ flex: 2, backgroundColor: "lightgray" }} >
                <View
                    style={{
                        flexDirection: "row",
                        height: 40,
                        padding: 0
                    }}
                >
                    <View style={{ backgroundColor: "#0089FC", flex: 3 }}>
                        <Text style={styles.titleText}>{titleText}</Text>
                    </View>
                    <View style={{ backgroundColor: "#0089FC", flex: 0.5 }}>
                        <Button title="ปิดการสนทนา" style={styles.button}
                            color={"blue"}
                            onPress={() => submit(chatText)}
                        />
                    </View>
                </View>
                <GiftedChat
                    messages={messages}
                    showAvatarForEveryMessage={true}
                    onSend={messages => onSend(messages, chatText, menuChat)}
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
        backgroundColor: '#0089FC',
        height: 40
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    titleText: {
        textAlign: 'center', 
        backgroundColor: '#0089FC',
        fontSize: 20,
        padding: 5,
        color: '#fff',
        height: 40

    },
    notiText: {
        textAlign: 'center',
        backgroundColor: 'red',
        fontSize: 10,
        padding: 5,
        marginTop: 5,
        marginRight: 5,
        color: '#fff',
        height: 20,
        width: 20,
        borderRadius: 10
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
    button: {
        justifyContent: 'center',
        width: 250,
        height: 40,
        borderRadius: 10
    },
    
});
