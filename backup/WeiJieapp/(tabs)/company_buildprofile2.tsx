import * as React from "react";
import {Text, StyleSheet, View, Pressable} from "react-native";
import Rectangle9 from "../../assets/SVGs/student_buildprofile_Rectangle 9.svg"
import BlueRectangle from "../../assets/SVGs/student_buildprofile_bluerectangle.svg"
import Group40 from "../../assets/SVGs/student_buildprofile2/Group 40.svg"
import Group8 from "../../assets/SVGs/student_buildprofile_Group 8.svg"
import Group12 from '../../assets/SVGs/student_buildprofile_group12.svg'; // adjust the path as needed


const CompBuildProf = () => {
  	
  	return (
    		<View style={styles.compBuildProf2}>
      			<View style={styles.homeIndicator}>
        				<View style={[styles.homeIndicator1, styles.capacityPosition]} />
      			</View>
      			<Text style={styles.yourRelevance}>YOUR RELEVANCE</Text>
      			<Pressable style={styles.wrapper} onPress={()=>{}}>
                        <Group12 width={100} height={100} style={styles.icon} />
      			</Pressable>
      			<View style={[styles.rectangleParent, styles.frameFlexBox]}>
                            <BlueRectangle style={styles.frameLayout} width={96} height={10} />
                            <BlueRectangle style={styles.frameLayout} width={96} height={10} />
          					<Rectangle9 style={styles.frameLayout} width={96} height={10} />
      			</View>
      			<View style={styles.groupParent}>
        				<View style={[styles.officeImagesParent, styles.parentLayout]}>
          					<Text style={[styles.officeImages, styles.textTypo]}>Office Images</Text>
          					<Text style={[styles.text, styles.textTypo]}>(0/5)</Text>
          					<Group40 style={[styles.groupChild, styles.groupLayout]} width={96} height={108} />
        				</View>
        				<Text style={[styles.pleaseUploadYour, styles.pleaseTypo]}>Please upload your images</Text>
      			</View>
      			<View style={[styles.groupContainer, styles.groupContainerPosition]}>
        				<View style={[styles.listTheJobVacancyDetailParent, styles.groupContainerPosition]}>
          					<Text style={styles.listTheJob}>List the Job Vacancy Detail</Text>
          					<Group40 style={[styles.groupItem, styles.groupLayout]} width={96} height={108} />
        				</View>
        				<Text style={[styles.pleaseUploadYour1, styles.pleaseTypo]}>Please upload your file</Text>
      			</View>
      			<Group8 style={styles.compBuildProf2Child} width={65} height={54} />
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
  	capacityPosition: {
    		backgroundColor: "#000",
    		left: "50%",
    		position: "absolute"
  	},
  	frameLayout: {
    		borderRadius: 5
  	},
  	parentLayout: {
    		height: 178,
    		top: 0
  	},
  	textTypo: {
    		fontSize: 16,
    		fontFamily: "Inter-Regular",
    		textAlign: "center",
    		color: "#000",
    		lineHeight: 22,
    		position: "absolute"
  	},
  	groupLayout: {
    		height: 108,
    		top: 70,
    		width: 96,
    		position: "absolute"
  	},
  	pleaseTypo: {
    		fontSize: 12,
    		top: 183,
    		fontFamily: "Inter-Regular",
    		left: "50%",
    		textAlign: "center",
    		color: "#000",
    		lineHeight: 22,
    		position: "absolute"
  	},
  	groupContainerPosition: {
    		width: 206,
    		marginLeft: -103,
    		left: "50%",
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
    		left: "50%",
    		height: "100%",
    		position: "absolute"
  	},
  	capIcon: {
    		height: "31.54%",
    		marginLeft: 12.35,
    		top: "36.78%",
    		bottom: "31.68%",
    		maxHeight: "100%",
    		width: 1,
    		opacity: 0.4,
    		left: "50%",
    		position: "absolute"
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
    		width: 328,
    		height: 32,
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
  	frameChild: {
    		backgroundColor: "#c1e8ff"
  	},
  	rectangleParent: {
    		top: 124,
    		left: 31,
    		gap: 20,
    		position: "absolute"
  	},
  	officeImages: {
    		marginLeft: -52.5,
    		left: "50%",
    		top: 0,
    		fontSize: 16
  	},
  	text: {
    		top: 24,
    		left: 32
  	},
  	groupChild: {
    		left: 5
  	},
  	officeImagesParent: {
    		marginLeft: -52,
    		width: 105,
    		left: "50%",
    		position: "absolute"
  	},
  	pleaseUploadYour: {
    		marginLeft: -76
  	},
  	groupParent: {
    		marginLeft: -79,
    		top: 206,
    		width: 152,
    		height: 205,
    		left: "50%",
    		position: "absolute"
  	},
  	listTheJob: {
    		marginLeft: -103,
    		fontSize: 16,
    		fontFamily: "Inter-Regular",
    		left: "50%",
    		textAlign: "center",
    		color: "#000",
    		lineHeight: 22,
    		top: 0,
    		position: "absolute"
  	},
  	groupItem: {
    		left: 55
  	},
  	listTheJobVacancyDetailParent: {
    		height: 178,
    		top: 0
  	},
  	pleaseUploadYour1: {
    		marginLeft: -64
  	},
  	groupContainer: {
    		top: 489,
    		height: 205
  	},
  	compBuildProf2Child: {
    		top: 50,
    		left: 162,
    		position: "absolute"
  	},
  	compBuildProf2: {
    		backgroundColor: "#fff",
    		height: 844,
    		overflow: "hidden",
    		width: "100%",
    		flex: 1
  	}
});

export default CompBuildProf;
