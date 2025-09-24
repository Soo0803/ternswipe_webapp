import * as React from "react";
import {Text, StyleSheet, Image, Pressable, View} from "react-native";
import BeginLogo from '../../assets/SVGs/beginlogo.svg';
import Vector1 from '../../assets/SVGs/begin_logovector.svg'
const Logo = () => {
return (
<View style={styles.logo}>
<View style={[styles.ternswipeParent, styles.ternswipePosition]}>
<Text style={[styles.ternswipe, styles.ternswipePosition]}>TERNSWIPE</Text>
<Pressable style={styles.wrapper} onPress={()=>{}}>
<BeginLogo width={100} height={100} style={styles.icon} />
</Pressable>
<Vector1 style={styles.groupChild} width={51} height={27} />
</View>
</View>);
};
const styles = StyleSheet.create({
ternswipePosition: {
width: 122,
marginLeft: -61,
left: "50%",
// right: "50%",
top: "48%",
position: "absolute"
},
ternswipe: {
marginTop: 36.5,
fontSize: 20,
fontFamily: "Inter-Regular",
color: "#000",
textAlign: "left",
height: 34
},
icon: {
marginTop: -70.5,
marginLeft: -50,
height: "100%",
width: "100%"
},
wrapper: {
width: 100,
height: 100,
left: "50%",
top: "50%",
position: "absolute"
},
groupChild: {
top: 54,
left: 47,
position: "absolute"
},
ternswipeParent: {
marginTop: -50,
height: 141
},
logo: {
backgroundColor: "#fff",
flex: 1,
height: 844,
overflow: "hidden",
width: "100%"
}
});
export default Logo;