import * as React from "react";
import {Image, StyleSheet, View, Text} from "react-native";
import Line23 from "../../assets/SVGs/banner_line23.svg"
import Vector2 from "../../assets/SVGs/banner_vector2.svg"
import Group7 from "../../assets/SVGs/group_7.svg"
import Group6 from "../../assets/SVGs/banner_group6.svg"
import Frame from "../../assets/SVGs/Frame.svg"


const Banner = () => {
  	
  	return (
    		<View style={styles.banner}>
      			<View style={[styles.image2Parent, styles.groupChildLayout]}>
						<Image style={styles.image2Icon} resizeMode="cover" source={require('../../assets/images/banner_image1.png')} />
						<Image style={styles.image1Icon} resizeMode="cover" source={require('../../assets/images/banner_image2.png')} />
        				<Vector2 style={[styles.groupChild, styles.groupChildLayout]} width={333} height={384} />
      			</View>
      			<Line23 style={styles.bannerChild} width={413} height={402} />
      			<Group7 style={styles.bannerItem} width={65} height={54} />
      			<View style={styles.groupParent}>
        				<View style={styles.ternswipeWrapper}>
          					<Text style={styles.ternswipe}>TERNSWIPE</Text>
        				</View>
        				<View style={[styles.yourFirstInternDeliveryTooWrapper, styles.yourLayout]}>
          					<Text style={[styles.yourFirstIntern, styles.swipeUpToTypo]}>{`YOUR FIRST INTERN DELIVERY TOOLS
STUDENT'S SOLUTION,
BUILD BY STUDENT`}</Text>
      			</View>
    		</View>
    		<View style={[styles.swipeUpToContinueParent, styles.swipeLayout]}>
      			<Text style={[styles.swipeUpTo, styles.swipeLayout]}>SWIPE UP TO CONTINUE</Text>
      			<Group6 style={styles.groupItem} width={20} height={20} />
    		</View>
    		<Frame style={styles.frameIcon} width={48} height={48} />
  	</View>);
};

const styles = StyleSheet.create({
groupChildLayout: {
  	width: 333,
  	position: "absolute"
},
image1IconPosition: {
  	top: 0,
  	left: 0,
  	position: "absolute"
},
yourLayout: {
  	height: 55,
  	width: 246,
  	position: "absolute"
},
swipeUpToTypo: {
  	fontSize: 12,
  	color: "#000",
  	textAlign: "left",
  	fontFamily: "Inter-Regular",
  	left: 0,
  	top: 0
},
swipeLayout: {
  	width: 144,
  	position: "absolute"
},
timeFlexBox: {
  	justifyContent: "center",
  	alignItems: "center"
},
borderPosition: {
  	left: "50%",
  	position: "absolute"
},
image2Icon: {
  	top: 210,
  	left: 19,
  	width: 309,
  	height: 314,
  	position: "absolute"
},
image1Icon: {
  	width: 328,
  	height: 206,
  	left: 0
},
groupChild: {
  	top: 146,
  	left: 0
},
image2Parent: {
  	top: 139,
  	height: 530,
  	left: 31
},
bannerChild: {
  	top: -321,
  	left: 381,
  	position: "absolute"
},
bannerItem: {
  	top: 66,
  	left: 31,
  	position: "absolute"
},
ternswipe: {
  	fontSize: 22,
  	color: "#c1e8ff",
  	textAlign: "left",
  	fontFamily: "Inter-Regular",
  	height: 24,
  	width: 148,
  	left: 0,
  	top: 0,
  	position: "absolute"
},
ternswipeWrapper: {
  	height: 24,
  	width: 148,
  	left: 0,
  	top: 0,
  	position: "absolute"
},
yourFirstIntern: {
  	color: "#000",
  	height: 55,
  	width: 246,
  	position: "absolute"
},
yourFirstInternDeliveryTooWrapper: {
  	top: 32,
  	left: 0
},
groupParent: {
  	top: 528,
  	height: 87,
  	width: 246,
  	left: 31,
  	position: "absolute"
},
swipeUpTo: {
  	height: 19,
  	color: "#000",
  	fontSize: 12,
  	textAlign: "left",
  	fontFamily: "Inter-Regular",
  	left: 0,
  	top: 0
},
groupItem: {
  	top: 24,
  	left: 60,
  	position: "absolute"
},
swipeUpToContinueParent: {
  	top: 755,
  	left: 123,
  	height: 44
},
frameIcon: {
  	top: 67,
  	left: 311,
  	position: "absolute",
  	overflow: "hidden"
},
time1: {
  	fontSize: 17,
  	lineHeight: 22,
  	fontWeight: "600",
  	fontFamily: "SF Pro",
  	textAlign: "center",
  	color: "#000"
},
time: {
  	paddingLeft: 16,
  	paddingRight: 6,
  	flexDirection: "row",
  	justifyContent: "center",
  	flex: 1
},
dynamicIslandSpacer: {
  	width: 124,
  	height: 10
},
capIcon: {
  	height: "31.54%",
  	marginLeft: 12.35,
  	top: "36.78%",
  	bottom: "31.68%",
  	maxHeight: "100%",
  	width: 1,
  	opacity: 0.4
},
capacity: {
  	height: "69.23%",
  	marginLeft: -11.65,
  	top: "15.38%",
  	bottom: "15.38%",
  	borderRadius: 3,
  	backgroundColor: "#000",
  	width: 21
},
levels: {
  	paddingLeft: 6,
  	paddingRight: 16,
  	gap: 7,
  	flexDirection: "row",
  	justifyContent: "center",
  	flex: 1
},
frame: {
  	alignSelf: "stretch",
  	justifyContent: "space-between",
  	gap: 0,
  	alignItems: "center",
  	flexDirection: "row"
},
banner: {
  	backgroundColor: "#fff",
  	width: "100%",
  	height: 844,
  	overflow: "hidden",
  	flex: 1
}
});

export default Banner;
