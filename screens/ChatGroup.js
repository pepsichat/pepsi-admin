import React, { useEffect, useState } from 'react'
import { SectionList, StyleSheet, Text, View, Image } from 'react-native';
import { SearchBar } from 'react-native-elements';

const ChatGroup = ({ navigation }) => {
    const [count, setCount] = useState(3);

    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);


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
        try {
            const response = await fetch('https://school.treesbot.com/pepsichat/select_user_and_log.php')
            const json = await response.json()
            setFilteredDataSource(json);
            setMasterDataSource(json);
            setCount(3)
        } catch (error) {
            console.error(error)
            setCount(3)
        }
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
        } catch (error) {
            //   alert(error)
            console.error(error)
        }
        navigation.navigate('Chat', {
            shopname: shopname,
            shopcode: shopcode,
            chatname: chatname,
            menu: menu,
        })
    }

    const FlatListItemSeparator = () => {
        return (
            //Item Separator
            <View style={styles.listItemSeparatorStyle} />
        );
    };

    return (


        <View style={{ backgroundColor: "write" }, styles.container}>
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


    )
}
export default ChatGroup

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