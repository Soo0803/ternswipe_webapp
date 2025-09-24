import {
    View,
    StyleSheet,
    Easing,
} from "react-native";

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import React from "react";
import * as Progress from "react-native-progress";

interface ProgressBarProps {
    process: number;
}

export default function ProgressBar ({ process } : ProgressBarProps) {
    return (
        <View style = {styles.bar}>
            <Progress.Bar 
            color="#A5CBE1"
            progress={process} 
            width={wp(78)} 
            height={hp(2)} 
            unfilledColor="#f5f5f5" 
            borderWidth={0} 
            borderRadius={5}
            animated = {true}
            animationConfig={{
                duration: 1000,
                easing: Easing.inOut(Easing.exp),
                useNativeDriver: false,
            }}
            indeterminateAnimationDuration={2000}
            />
        </View>
    )
}

const styles = StyleSheet.create ({
    bar:{
        paddingTop: hp(2),
    },
});