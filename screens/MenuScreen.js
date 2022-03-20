import React from 'react'
import { View, StyleSheet, Image, Button } from 'react-native'

const MenuScreen = ({ navigation }) => {

    return (

        <View style={style.container}>
            <Image
                source={require("../assets/Pepsi-Logo.png")}
                resizeMode="contain"
                style={style.logo1}
            ></Image>

            <View style={[style.containerrow, {

                flexDirection: "row"
            }]}>


                <Button title="Live Chat" style={style.button}
                    color={"#EE0000"}
                    onPress={() => navigation.navigate('Chat')}
                />

                &nbsp; &nbsp; &nbsp; &nbsp;


                <Button title="History" style={style.button}
                    color={"#EE0000"} width='250' height='100'
                    onPress={() => navigation.navigate('History')}
                />
            </View>
        </View>
    )
}
export default MenuScreen
const style = StyleSheet.create({
    button: {
        width: 250,
        height: 100,
        marginTop: 20
    },
    container: {
        flex: 1,
        backgroundColor: "rgba(0,102,204,1)",
        alignItems: "center",
        padding: 10
    },
    containerrow: {
        //  flex: 1,
        backgroundColor: "rgba(0,102,204,1)",
        alignItems: "center",
        padding: 10
    },
    logo1: {
        height: 150,
        width: 220
    },


})