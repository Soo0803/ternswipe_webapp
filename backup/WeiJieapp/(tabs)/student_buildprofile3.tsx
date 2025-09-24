import * as React from "react";
import {Text, StyleSheet, View, Pressable} from "react-native";
import Group6 from "../../assets/SVGs/student_buildprofile3/group6.svg"
import Group8 from "../../assets/SVGs/student_buildprofile_Group 8.svg"

const StudBuildProf = () => {
  	
  	return (
    		<View style={styles.studBuildProf3}>
      			<View style={[styles.rectangleParent, styles.finalParentPosition]}>
        				<View style={styles.frameChild} />
        				<View style={styles.frameChild} />
        				<View style={styles.frameChild} />
      			</View>
      			<View style={[styles.homeIndicator, styles.homeIndicatorPosition]}>
        				<View style={[styles.homeIndicator1, styles.capacityPosition]} />
      			</View>
      			<View style={[styles.finalStepParent, styles.finalParentPosition]}>
        				<Text style={[styles.finalStep, styles.emailTypo]}>FINAL STEP</Text>
        				<View style={styles.groupParent}>
          					<View style={[styles.emailParent, styles.groupParentLayout]}>
            						<Text style={[styles.email, styles.emailTypo]}>Email</Text>
            						<View style={[styles.groupChild, styles.groupParentLayout]} />
          					</View>
          					<View style={[styles.passwordParent, styles.groupParentLayout]}>
            						<Text style={[styles.email, styles.emailTypo]}>Password</Text>
            						<View style={[styles.groupChild, styles.groupParentLayout]} />
          					</View>
          					<View style={[styles.rectangleGroup, styles.groupParentLayout]}>
            						<View style={[styles.groupChild, styles.groupParentLayout]} />
            						<Text style={[styles.email, styles.emailTypo]}>Username</Text>
          					</View>
        				</View>
      			</View>
      			<View style={[styles.swipeUpToFinishRegistratioParent, styles.timeFlexBox]}>
        				<Text style={[styles.swipeUpTo, styles.emailTypo]}>SWIPE UP TO FINISH REGISTRATION</Text>
        				<Group6 style={styles.groupIcon} width={20} height={20} />
      			</View>
      			<Group8 style={styles.studBuildProf3Child} width={65} height={54} />
    		</View>);
};

const styles = StyleSheet.create({
  	homeIndicatorPosition: {
    		width: 390,
    		left: 0,
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
  	capacityPosition: {
    		backgroundColor: "#000",
    		left: "50%",
    		position: "absolute"
  	},
  	finalParentPosition: {
    		marginLeft: -164,
    		left: "50%",
    		position: "absolute"
  	},
  	emailTypo: {
    		fontFamily: "Inter-Regular",
    		textAlign: "center"
  	},
  	groupParentLayout: {
    		height: 28,
    		position: "absolute"
  	},
  	time1: {
    		fontWeight: "600",
    		fontFamily: "SF Pro",
    		textAlign: "center",
    		color: "#000",
    		lineHeight: 22,
    		fontSize: 17
  	},
  	time: {
    		paddingLeft: 16,
    		paddingRight: 6,
    		flexDirection: "row",
    		flex: 1
  	},
  	dynamicIslandSpacer: {
    		width: 124,
    		height: 10
  	},
  	cellularConnectionIcon: {},
  	wifiIcon: {},
  	border: {
    		height: "100%",
    		marginLeft: -13.65,
    		top: "0%",
    		bottom: "0%",
    		borderRadius: 4,
    		borderStyle: "solid",
    		borderColor: "#000",
    		borderWidth: 1,
    		width: 25,
    		opacity: 0.35
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
    		width: 21
  	},
  	battery: {
    		width: 27,
    		height: 13
  	},
  	levels: {
    		paddingLeft: 6,
    		paddingRight: 16,
    		gap: 7,
    		flexDirection: "row",
    		flex: 1
  	},
  	frame: {
    		justifyContent: "space-between",
    		gap: 0,
    		flexDirection: "row",
    		alignSelf: "stretch",
    		alignItems: "center"
  	},
  	statusBarIphone: {
    		height: 50,
    		paddingTop: 15,
    		alignItems: "center",
    		top: 0
  	},
  	frameChild: {
    		width: 96,
    		backgroundColor: "#c1e8ff",
    		borderRadius: 5,
    		height: 10
  	},
  	rectangleParent: {
    		top: 124,
    		gap: 20,
    		flexDirection: "row",
    		alignItems: "center"
  	},
  	homeIndicator1: {
    		marginLeft: 72,
    		bottom: 8,
    		borderRadius: 100,
    		width: 144,
    		height: 5,
    		transform: [
      			{
        				rotate: "180deg"
      			}
    		]
  	},
  	homeIndicator: {
    		top: 810,
    		height: 34
  	},
  	finalStep: {
    		color: "#7da0ca",
    		width: 328,
    		marginLeft: -164,
    		left: "50%",
    		position: "absolute",
    		lineHeight: 22,
    		fontFamily: "Inter-Regular",
    		fontSize: 17,
    		top: 0
  	},
  	email: {
    		top: 3,
    		fontSize: 16,
    		color: "#000",
    		fontFamily: "Inter-Regular",
    		lineHeight: 22,
    		left: 0,
    		position: "absolute"
  	},
  	groupChild: {
    		left: 116,
    		backgroundColor: "rgba(217, 217, 217, 0.5)",
    		width: 212,
    		borderRadius: 5,
    		top: 0
  	},
  	emailParent: {
    		top: 38,
    		width: 328,
    		left: 0
  	},
  	passwordParent: {
    		top: 76,
    		width: 328,
    		left: 0
  	},
  	rectangleGroup: {
    		width: 328,
    		left: 0,
    		top: 0
  	},
  	groupParent: {
    		top: 42,
    		height: 104,
    		width: 328,
    		left: 0,
    		position: "absolute"
  	},
  	finalStepParent: {
    		top: 321,
    		height: 146,
    		width: 328
  	},
  	swipeUpTo: {
    		fontSize: 12,
    		height: 19,
    		color: "#000",
    		fontFamily: "Inter-Regular",
    		alignSelf: "stretch"
  	},
  	groupIcon: {},
  	swipeUpToFinishRegistratioParent: {
    		top: 749,
    		left: 31,
    		borderRadius: 10,
    		height: 61,
    		gap: 5,
    		width: 328,
    		backgroundColor: "#c1e8ff",
    		position: "absolute"
  	},
  	studBuildProf3Child: {
    		top: 50,
    		left: 167,
    		position: "absolute"
  	},
  	studBuildProf3: {
    		backgroundColor: "#fff",
    		width: "100%",
    		height: 844,
    		overflow: "hidden",
    		flex: 1
  	}
});

export default StudBuildProf;
