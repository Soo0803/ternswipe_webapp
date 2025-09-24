import * as React from "react";
import {Text, StyleSheet, View, Pressable} from "react-native";
import Rectangle9 from "../../assets/SVGs/student_buildprofile2/rectangle9.svg"
import BlueRectangle from "../../assets/SVGs/student_buildprofile_bluerectangle.svg"
import Group40 from "../../assets/SVGs/student_buildprofile2/Group 40.svg"
import Group8 from "../../assets/SVGs/student_buildprofile_Group 8.svg"
import Group12 from "../../assets/SVGs/student_buildprofile2/group12.svg"

const StudBuildProf = () => {
  	
  	return (
    		<View style={styles.studBuildProf2}>
      			<View style={styles.homeIndicator}>
        				<View style={[styles.homeIndicator1, styles.capacityPosition]} />
      			</View>
      			<Text style={styles.yourRelevance}>YOUR RELEVANCE</Text>
      			<Pressable style={styles.wrapper} onPress={()=>{}}>
                        <Group12 style={styles.groupIcon} width={65} height={54} />
      			</Pressable>
      			<View style={[styles.groupParent, styles.groupParentPosition]}>
        				<View style={[styles.rectangleParent, styles.rectangleLayout]}>
          					<View style={[styles.groupChild, styles.groupLayout1]} />
          					<Text style={[styles.preferredWorkingLocation, styles.yourResumeTypo]}>Preferred Working Location</Text>
        				</View>
        				<View style={[styles.rectangleGroup, styles.rectangleLayout]}>
          					<View style={[styles.groupItem, styles.groupLayout1]} />
          					<Text style={[styles.phoneNumber, styles.yourResumeTypo]}>Phone Number</Text>
        				</View>
      			</View>
      			<View style={[styles.rectangleContainer, styles.groupParentPosition]}>
                        <BlueRectangle style={styles.frameLayout} width={96} height={10} />
                        <BlueRectangle style={styles.frameLayout} width={96} height={10} />
        				<Rectangle9 style={styles.frameLayout} width={96} height={10} />
      			</View>
      			<View style={[styles.currentGradeTranscriptParent, styles.currentPosition]}>
        				<Text style={[styles.currentGradeTranscript, styles.yourResumeTypo]}>Current Grade Transcript</Text>
        				<Group40 style={[styles.groupInner, styles.groupLayout]} width={96} height={108} />
      			</View>
      			<View style={[styles.yourResumeParent, styles.yourPosition]}>
        				<Text style={[styles.yourResume, styles.yourPosition]}>Your Resume</Text>
        				<Group40 style={[styles.groupIcon, styles.groupLayout]} width={96} height={108} />
      			</View>
      			<Text style={[styles.pleaseUploadYour, styles.pleaseTypo]}>Please upload your file</Text>
      			<Text style={[styles.pleaseUploadYour1, styles.pleaseTypo]}>Please upload your file</Text>
      			<Group8 style={styles.studBuildProf2Child} width={65} height={54} />
    		</View>);
};

const styles = StyleSheet.create({
  	frameFlexBox: {
    		flexDirection: "row",
    		alignItems: "center"
  	},
  	timeFlexBox: {
    		justifyContent: "center",
    		flexDirection: "row",
    		alignItems: "center",
    		flex: 1
  	},
  	currentPosition: {
    		left: "50%",
    		position: "absolute"
  	},
  	capacityPosition: {
    		backgroundColor: "#000",
    		left: "50%",
    		position: "absolute"
  	},
  	groupParentPosition: {
    		left: 31,
    		position: "absolute"
  	},
  	rectangleLayout: {
    		height: 28,
    		width: 328,
    		left: 0,
    		position: "absolute"
  	},
  	groupLayout1: {
    		backgroundColor: "rgba(217, 217, 217, 0.5)",
    		borderRadius: 5,
    		height: 28,
    		top: 0,
    		position: "absolute"
  	},
  	yourResumeTypo: {
    		fontSize: 16,
    		fontFamily: "Inter-Regular",
    		textAlign: "center",
    		color: "#000",
    		lineHeight: 22
  	},
  	frameLayout: {
    		borderRadius: 5
  	},
  	groupLayout: {
    		height: 108,
    		top: 70,
    		width: 96,
    		position: "absolute"
  	},
  	yourPosition: {
    		marginLeft: -50,
    		left: "50%",
    		position: "absolute"
  	},
  	pleaseTypo: {
    		fontSize: 12,
    		marginLeft: -64,
    		fontFamily: "Inter-Regular",
    		left: "50%",
    		textAlign: "center",
    		color: "#000",
    		lineHeight: 22,
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
    		paddingRight: 6
  	},
  	dynamicIslandSpacer: {
    		width: 124,
    		height: 10,
    		justifyContent: "center",
    		alignItems: "center"
  	},
  	cellularConnectionIcon: {},
  	wifiIcon: {},
  	border: {
    		marginLeft: -13.65,
    		top: "0%",
    		bottom: "0%",
    		borderRadius: 4,
    		borderStyle: "solid",
    		borderColor: "#000",
    		borderWidth: 1,
    		width: 25,
    		opacity: 0.35,
    		height: "100%"
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
    		gap: 7
  	},
  	frame: {
    		alignSelf: "stretch",
    		justifyContent: "space-between",
    		gap: 0
  	},
  	statusBarIphone: {
    		height: 50,
    		paddingTop: 15,
    		alignItems: "center",
    		width: 390,
    		left: 0,
    		top: 0,
    		position: "absolute"
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
    		height: 34,
    		width: 390,
    		left: 0,
    		position: "absolute"
  	},
  	yourRelevance: {
    		marginLeft: -164,
    		top: 154,
    		color: "#7da0ca",
    		height: 32,
    		width: 328,
    		fontFamily: "Inter-Regular",
    		left: "50%",
    		textAlign: "center",
    		lineHeight: 22,
    		fontSize: 17,
    		position: "absolute"
  	},
  	icon: {
    		height: "100%",
    		width: "100%"
  	},
  	wrapper: {
    		right: 31,
    		bottom: 29,
    		width: 42,
    		height: 42,
    		position: "absolute"
  	},
  	groupChild: {
    		left: 227,
    		width: 101
  	},
  	preferredWorkingLocation: {
    		width: 210,
    		top: 3,
    		fontSize: 16,
    		left: 0,
    		position: "absolute"
  	},
  	rectangleParent: {
    		top: 0
  	},
  	groupItem: {
    		left: 134,
    		width: 194
  	},
  	phoneNumber: {
    		top: 3,
    		fontSize: 16,
    		left: 0,
    		position: "absolute"
  	},
  	rectangleGroup: {
    		top: 49
  	},
  	groupParent: {
    		top: 201,
    		height: 77,
    		width: 328
  	},
  	frameChild: {
    		backgroundColor: "#c1e8ff"
  	},
  	rectangleContainer: {
    		top: 124,
    		gap: 20,
    		flexDirection: "row",
    		alignItems: "center"
  	},
  	currentGradeTranscript: {
    		marginLeft: -94.5,
    		left: "50%",
    		position: "absolute",
    		top: 0
  	},
  	groupInner: {
    		left: 47
  	},
  	currentGradeTranscriptParent: {
    		marginLeft: -95,
    		top: 295,
    		width: 189,
    		height: 178
  	},
  	yourResume: {
    		fontSize: 16,
    		fontFamily: "Inter-Regular",
    		textAlign: "center",
    		color: "#000",
    		lineHeight: 22,
    		top: 0
  	},
  	groupIcon: {
    		left: 2
  	},
  	yourResumeParent: {
    		top: 553,
    		width: 100,
    		height: 178
  	},
  	pleaseUploadYour: {
    		top: 478
  	},
  	pleaseUploadYour1: {
    		top: 736
  	},
  	studBuildProf2Child: {
    		top: 50,
    		left: 162,
    		position: "absolute"
  	},
  	studBuildProf2: {
    		backgroundColor: "#fff",
    		height: 844,
    		overflow: "hidden",
    		width: "100%",
    		flex: 1
  	}
});

export default StudBuildProf;
