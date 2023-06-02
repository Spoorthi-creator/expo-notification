import * as React from "react"
import { 
    View, 
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    SafeAreaView
} from "react-native"
import { RFValue } from "react-native-responsive-fontsize";

export default class WorkTab extends React.Component{
    render(){
        return(
            <View style = {styles.container}>

                <SafeAreaView style = {styles.droidSafeArea} />

                <Text>WorkTab</Text>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container : {
        flex : RFValue(1)
    },

    droidSafeArea : {
        marginTop: Platform.OS == "android" ? StatusBar.currentHeight : RFValue(0)
    }
})