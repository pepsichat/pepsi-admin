import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native';
import { db, storage } from '../firebase';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { Video, Audio } from 'expo-av';
import { CommonActions } from '@react-navigation/native';

const ChatPage = ({ route, navigation }) => {
    const [messages, setMessages] = useState([]);
    const { shopname, shopcode, chatname, menu } = route.params;
    const [count, setCount] = useState(3);

    useEffect(() => {
        const unsubscribe = db.collection(chatname).orderBy('createdAt', 'desc').onSnapshot(snapshot => {
            setMessages(
                snapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user,
                    image: doc.data().image,
                    video: doc.data().video,
                    received: doc.data().received
                }))
            )
        })
        return () => unsubscribe;
    }, [])

    useEffect(() => {
        // selectChatLog()
        const countTimer = setInterval(() => {
            manageTimer();
        }, 1000);
        // and clear this timer when the component is unmounted
        return function cleanup() {
            clearInterval(countTimer);
        };
    });

    const manageTimer = async () => {

        if (count == 0) {

        } else if (count == 1) {
            selectChatLog()
        } else {
            setCount(count - 1)
        }
    }

    const selectChatLog = async () => {
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

            const cityRef = db.collection(chatname).where("user._id", "==", shopcode)
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        doc.ref.update({ received: true })
                    });
                })

            setCount(3)
        } catch (error) {
            setCount(3)
            console.error(error)
        }
    }

    const onSend = useCallback((messages = []) => {
        //alert("chatName" + chatName + '  shopCode ' + shopCode + ' menu ' + menuChat)
        //  alert("chatText " + chatText)
        insertChatLog(chatname, menu)
        //   setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        const {
            _id,
            createdAt,
            text,
            user,
            received
        } = messages[0]
        db.collection(chatname).add({
            _id,
            createdAt,
            text,
            user,
            received: false
        })

    }, [])

    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);

    const [urls, setUrls] = useState([]);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        setImages([]);
        setUrls([]);
        for (let i = 0; i < e.target.files.length; i++) {
            const newImage = e.target.files[i];
            newImage["id"] = Math.random();
            setImages((prevState) => [...prevState, newImage]);
        }
    };

    const handleUpload = async () => {
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds

        const filename = 'admin_' + year + month + date + hours + min + sec

        const promises = [];
        images.map((image) => {
            const uploadTask = storage.ref(`images/${filename}`).put(image);

            promises.push(uploadTask);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                (error) => {
                    console.log(error);
                },
                async () => {
                    await storage
                        .ref("images")
                        .child(filename)
                        .getDownloadURL()
                        .then((urls) => {
                            uploadImagePicked(urls)
                            setUrls((prevState) => [...prevState, urls]);
                        });
                }
            );
            //  uploadImagePicked()
        });

        /*
                Promise.all(promises)
                    .then(() => )
                    .catch((err) => console.log(err));
                  */
    };

    const uploadImagePicked = (geturls) => {
        const randomid = Math.random().toString(36).substring(7)
        let msg = {
            _id: randomid,
            text: '',
            createdAt: new Date(),
            user: {
                _id: 'Admin',
                name: 'Admin',
                avatar: 'https://static-s.aa-cdn.net/img/gp/20600014266053/JVWGO91AFGOSfDoqO3V_YlUiWnCoiyob0aPkVOss0qASb26aRbXvWiiNK12ZFLxfsSw=s300?v=1'
            },
            image: geturls
        }

        const {
            _id,
            createdAt,
            text,
            user,
            image,
            received
        } = [msg][0]
        db.collection(chatname).add({
            _id,
            createdAt,
            text,
            user,
            image,
            received: false
        })
        insertChatLog(chatname, menu)

    }


    const handleChangevdo = (e) => {
        setVideos([]);
        setUrls([]);
        for (let i = 0; i < e.target.files.length; i++) {
            const newImage = e.target.files[i];
            newImage["id"] = Math.random();

            setVideos((prevState) => [...prevState, newImage]);
        }
    };

    const handleUploadvdo = async () => {
        const promises = [];
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var hours = new Date().getHours(); //Current Hours
        var min = new Date().getMinutes(); //Current Minutes
        var sec = new Date().getSeconds(); //Current Seconds

        const filename = 'admin_' + year + month + date + hours + min + sec

        videos.map((image) => {
            const uploadTask = storage.ref(`videos/${filename}`).put(image);

            promises.push(uploadTask);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                (error) => {
                    console.log(error);
                },
                async () => {
                    await storage
                        .ref("videos")
                        .child(filename)
                        .getDownloadURL()
                        .then((urls) => {
                            uploadVideosPicked(urls)
                            setUrls((prevState) => [...prevState, urls]);
                        });
                }
            );
            //  uploadImagePicked()
        });

        /*
                Promise.all(promises)
                    .then(() => )
                    .catch((err) => console.log(err));
                  */
    };
    const uploadVideosPicked = (geturls) => {
        const randomid = Math.random().toString(36).substring(7)
        let msg = {
            _id: randomid,
            text: '',
            createdAt: new Date(),
            user: {
                _id: 'Admin',
                name: 'Admin',
                avatar: 'https://static-s.aa-cdn.net/img/gp/20600014266053/JVWGO91AFGOSfDoqO3V_YlUiWnCoiyob0aPkVOss0qASb26aRbXvWiiNK12ZFLxfsSw=s300?v=1'
            },
            video: geturls
        }

        const {
            _id,
            createdAt,
            text,
            user,
            video,
            received
        } = [msg][0]
        db.collection(chatname).add({
            _id,
            createdAt,
            text,
            user,
            video,
            received: false
        })
        insertChatLog(chatname, menu)

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

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                tickStyle={{
                    color: props.currentMessage.received ? '#00FF00' : '#454545'
                }}
                timeTextStyle={{
                    right: {
                        color: 'rgb(255,255,255)'
                    },
                    left: {
                        color: 'rgb(0,0,0)'
                    },
                }}
                textStyle={{
                    right: {
                        color: 'rgb(255,255,255)'
                    },
                    left: {
                        color: 'rgb(0,0,0)'
                    },

                }}
                wrapperStyle={{
                    right:
                    {
                        backgroundColor: 'rgba(0,102,204,1)',
                        borderRadius: 15
                    },
                    left:
                    {
                        backgroundColor: 'rgb(255,255,255)',
                        borderRadius: 15
                    }
                }}
                quickReplyStyle={{
                    color: 'rgba(0,102,204,1)',
                    borderWidth: 2,
                    borderRadius: 30,
                    backgroundColor: 'rgb(255,255,255)'
                }}

            />
        );
    };

    const renderMessageVideo = (props) => {
        const { currentMessage } = props;
        return (
            <View style={{ position: 'relative', height: 150, width: 250 }}>
                <Video
                    resizeMode="cover"
                    height={150}
                    width={250}
                    useNativeControls
                    shouldPlay={false}
                    source={{ uri: currentMessage.video }}
                />
            </View>
        );
    };

    const submit = async () => {
        const res = window.confirm("ยืนยันปิดการสนทนา " + shopname);

        if (res) {
            // show your message success
            console.log("fofonn submit")
            updateChat()
        }
    }

    const updateChat = async () => {
        var Data = {
            chatname: chatname,
            status: 'no'
        };
        try {
            const response = await fetch('https://school.treesbot.com/pepsichat/close_chat.php', {
                method: 'POST',
                body: JSON.stringify(Data)
            })
            const json = await response.json()
            if (json[0].Message == 'Complete') {
                console.log("fofonn Complete")
                navigation.dispatch(CommonActions.goBack());
            }
            // alert(json[0].Message)
        } catch (error) {
            alert(error)
            console.error(error)
        }
    }

    return (

        <View style={{ flex: 1, backgroundColor: "lightgray" }} >
            <View
                style={{
                    flexDirection: "row",
                    height: 40,
                    padding: 0
                }}
            >
                <View style={{ backgroundColor: "#0089FC", flex: 3 }}>
                    <Text style={styles.titleText}>{shopname}</Text>
                </View>
                <View style={{ backgroundColor: "#0089FC", flex: 0.5 }}>
                    <Button title="ปิดการสนทนา" style={styles.button}
                        color={"blue"}
                        onPress={() => submit()}
                    />
                </View>
            </View>
            <GiftedChat
                messages={messages}
                showAvatarForEveryMessage={true}
                renderBubble={renderBubble}
                renderMessageVideo={renderMessageVideo}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 'Admin',
                    name: 'Admin',
                    avatar: 'https://static-s.aa-cdn.net/img/gp/20600014266053/JVWGO91AFGOSfDoqO3V_YlUiWnCoiyob0aPkVOss0qASb26aRbXvWiiNK12ZFLxfsSw=s300?v=1'
                }}
            />
            <View
                style={{
                    flexDirection: "row",
                    height: 25,
                    padding: 0,
                    marginLeft: 20
                }}
            >
                <View style={{ backgroundColor: "lightgray" }}>
                    <div style={{ textAlign: "right", marginRight: 10 }} >
                        <input type="file" id="upload-file" hidden onChange={handleChange} onDrop={handleUpload} accept="image/*" />
                        <label for="upload-file">เลือกรูปภาพ</label>
                    </div>
                </View>
                <View style={{ backgroundColor: "lightgray" }}>
                    <div>
                        <button style={{ backgroundColor: 'rgba(0,102,204,1)', borderRadius: 10, color: '#fff', marginRight: 10 }} onClick={handleUpload}>ส่งรูป</button>
                    </div>

                </View>
                <View style={{ backgroundColor: "lightgray" }}>
                    <div style={{ textAlign: "right", marginRight: 10 }} >
                        <input type="file" id="upload-file-video" hidden onChange={handleChangevdo} accept="video/*" />
                        <label for="upload-file-video">เลือกวิดีโอ</label>
                    </div>

                </View>
                <View style={{ backgroundColor: "lightgray" }}>
                    <div>
                        <button style={{ backgroundColor: 'rgba(0,102,204,1)', borderRadius: 10, color: '#fff', marginRight: 10 }} onClick={handleUploadvdo}>ส่งวิดีโอ</button>
                    </div>
                </View>
            </View>

        </View>
    )
}
export default ChatPage
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