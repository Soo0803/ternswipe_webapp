import {
    View,
    StyleSheet,
    Easing,
} from "react-native";

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import React from "react";
import * as Progress from "react-native-progress";
import { palette } from '../constants/theme';
import { isWeb } from '../utils/platform';

interface ProgressBarProps {
    process: number;
}

export default function ProgressBar ({ process } : ProgressBarProps) {
    const progressWidth = isWeb ? undefined : wp(78);

    return (
        <View style={styles.bar}>
            <Progress.Bar 
                color={palette.primary}
                progress={process} 
                width={progressWidth}
                style={progressWidth === undefined ? styles.webWidth : undefined}
                height={hp(2)} 
                unfilledColor={palette.surfaceMuted} 
                borderWidth={0} 
                borderRadius={5}
                animated={true}
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
        alignItems: 'center',
    },
    webWidth: {
        alignSelf: 'stretch',
    },
});