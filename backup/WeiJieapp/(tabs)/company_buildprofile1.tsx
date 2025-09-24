import * as React from "react";
import {StyleSheet, View, Text, Pressable} from "react-native";
import Rectangle9 from "../../assets/SVGs/student_buildprofile_Rectangle 9.svg"
import Group8 from "../../assets/SVGs/student_buildprofile_Group 8.svg"
import BlueRectangle from "../../assets/SVGs/student_buildprofile_bluerectangle.svg"
import Group12 from '../../assets/SVGs/student_buildprofile_group12.svg'; // adjust the path as needed

const CompanyBuildProf = () => {
  	
  	return (
    		<View style={styles.companyBuildProf}>
      			<View style={styles.companyBuildProfChild} />
      			<Text style={[styles.whoAreYou, styles.groupLayout1]}>WHO ARE YOU?</Text>
        				<View style={[styles.rectangleParent, styles.timeFlexBox]}>
                            <BlueRectangle style={styles.frameLayout} width={96} height={10} />
							<Rectangle9 style={styles.frameLayout} width={96} height={10} />
          					<Rectangle9 style={styles.frameLayout} width={96} height={10} />
        				</View>
        				<Pressable style={styles.wrapper} onPress={()=>{}}>
                            <Group12 width={100} height={100} style={styles.icon} />
        				</Pressable>
        				<View style={[styles.rectangleGroup, styles.groupLayout]}>
          					<View style={[styles.groupChild, styles.groupLayout]} />
          					<Text style={[styles.connectLinkedin, styles.profilePictureTypo]}>Connect Linkedin</Text>
        				</View>
        				<View style={[styles.companyBuildProfItem, styles.companyBorder]} />
        				<View style={[styles.companyBuildProfInner, styles.companyBorder]} />
        				<Text style={[styles.profilePicture, styles.profilePictureTypo]}>Profile Picture</Text>
        				<Group8 style={styles.groupIcon} width={65} height={54} />
        				<View style={[styles.groupParent, styles.groupLayout1]}>
          					<View style={[styles.groupContainer, styles.groupLayout1]}>
            						<View style={[styles.nameParent, styles.parentLayout]}>
              							<Text style={[styles.name, styles.nameTypo]}>Name</Text>
              							<View style={[styles.groupItem, styles.rectangleLayout]} />
            						</View>
            						<Text style={[styles.companyDescription, styles.profilePictureTypo]}>Company Description</Text>
            						<View style={[styles.groupInner, styles.groupBg]} />
            						<View style={[styles.yearEstablishedParent, styles.parentLayout]}>
              							<Text style={[styles.yearEstablished, styles.nameTypo]}>Year Established</Text>
              							<View style={[styles.rectangleContainer, styles.rectangleLayout]}>
                								<View style={[styles.rectangleView, styles.rectangleLayout]} />
                								<Text style={[styles.optionalIf, styles.whoAreYouTypo]}>(optional / if any)</Text>
              							</View>
            						</View>
          					</View>
          					<Text style={[styles.companyBiodata, styles.nameTypo]}>COMPANY BIODATA</Text>
        				</View>
        				</View>);
      			};
      			
      			const styles = StyleSheet.create({
        				timeFlexBox: {
          					justifyContent: "center",
          					flexDirection: "row"
        				},
        				groupLayout1: {
          					width: 328,
          					position: "absolute"
        				},
        				frameLayout: {
          					borderRadius: 5
        				},
        				groupLayout: {
          					height: 30,
          					width: 156,
          					position: "absolute"
        				},
        				profilePictureTypo: {
          					fontSize: 15,
          					fontFamily: "Inter-Regular",
          					textAlign: "center",
          					lineHeight: 22,
          					position: "absolute"
        				},
        				companyBorder: {
          					borderColor: "#fff",
          					borderStyle: "solid",
          					position: "absolute"
        				},
        				parentLayout: {
          					height: 28,
          					width: 328,
          					left: 0,
          					position: "absolute"
        				},
        				nameTypo: {
          					textAlign: "left",
          					fontSize: 16,
          					fontFamily: "Inter-Regular",
          					lineHeight: 22,
          					position: "absolute"
        				},
        				rectangleLayout: {
          					width: 197,
          					height: 28,
          					top: 0,
          					position: "absolute"
        				},
        				groupBg: {
          					backgroundColor: "rgba(217, 217, 217, 0.5)",
          					borderRadius: 5
        				},
        				whoAreYouTypo: {
          					fontFamily: "Inter-Regular",
          					textAlign: "center",
          					lineHeight: 22
        				},
        				companyBuildProfChild: {
          					top: 186,
          					width: 99,
          					height: 108,
          					backgroundColor: "#d9d9d9",
          					left: 31,
          					position: "absolute"
        				},
        				time1: {
          					fontWeight: "600",
          					fontFamily: "SF Pro",
          					textAlign: "center",
          					lineHeight: 22,
          					color: "#000",
          					fontSize: 17
        				},
        				time: {
          					paddingLeft: 16,
          					paddingRight: 6,
          					alignItems: "center",
          					flex: 1,
          					justifyContent: "center"
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
          					borderColor: "#000",
          					borderWidth: 1,
          					width: 25,
          					opacity: 0.35,
          					borderStyle: "solid",
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
          					backgroundColor: "#000",
          					width: 21,
          					left: "50%",
          					position: "absolute"
        				},
        				battery: {
          					width: 27,
          					height: 13
        				},
        				levels: {
          					paddingLeft: 6,
          					paddingRight: 16,
          					gap: 7,
          					alignItems: "center",
          					flex: 1,
          					justifyContent: "center"
        				},
        				frame: {
          					alignSelf: "stretch",
          					justifyContent: "space-between",
          					gap: 0,
          					flexDirection: "row",
          					alignItems: "center"
        				},
        				statusBarIphone: {
          					width: 390,
          					height: 50,
          					paddingTop: 15,
          					alignItems: "center",
          					left: 0,
          					top: 0,
          					position: "absolute"
        				},
        				whoAreYou: {
          					marginLeft: -163,
          					top: 154,
          					color: "#7da0ca",
          					height: 32,
          					fontFamily: "Inter-Regular",
          					textAlign: "center",
          					lineHeight: 22,
          					left: "50%",
          					fontSize: 17,
          					width: 328
        				},
        				frameChild: {
          					backgroundColor: "#c1e8ff"
        				},
        				frameItem: {
          					backgroundColor: "#d9d9d9"
        				},
        				rectangleParent: {
          					top: 124,
          					left: 32,
          					gap: 20,
          					position: "absolute"
        				},
        				icon: {
          					height: "100%",
          					width: "100%"
        				},
        				wrapper: {
          					right: 31,
          					bottom: 73,
          					width: 42,
          					height: 42,
          					position: "absolute"
        				},
        				groupChild: {
          					borderRadius: 10,
          					left: 0,
          					top: 0,
          					backgroundColor: "#d9d9d9"
        				},
        				connectLinkedin: {
          					left: 14,
          					color: "#fff",
          					width: 127,
          					top: 4
        				},
        				rectangleGroup: {
          					top: 220,
          					left: 202
        				},
        				companyBuildProfItem: {
          					top: 214,
          					left: 78,
          					borderRightWidth: 2,
          					width: 2,
          					height: 52
        				},
        				companyBuildProfInner: {
          					top: 239,
          					left: 55,
          					borderTopWidth: 2,
          					width: 52,
          					height: 2
        				},
        				profilePicture: {
          					top: 297,
          					color: "#000",
          					left: 31
        				},
        				groupIcon: {
          					top: 50,
          					left: 162,
          					position: "absolute"
        				},
        				name: {
          					top: 3,
          					width: 93,
          					color: "#000",
          					left: 0
        				},
        				groupItem: {
          					backgroundColor: "rgba(217, 217, 217, 0.5)",
          					borderRadius: 5,
          					left: 131,
          					width: 197
        				},
        				nameParent: {
          					top: 0
        				},
        				companyDescription: {
          					top: 76,
          					color: "#000",
          					left: 0
        				},
        				groupInner: {
          					top: 101,
          					height: 158,
          					width: 328,
          					position: "absolute",
          					left: 0
        				},
        				yearEstablished: {
          					width: 128,
          					top: 4,
          					color: "#000",
          					left: 0
        				},
        				rectangleView: {
          					backgroundColor: "rgba(217, 217, 217, 0.5)",
          					borderRadius: 5,
          					left: 0
        				},
        				optionalIf: {
          					left: 45,
          					fontSize: 12,
          					color: "#8f8b8b",
          					width: 107,
          					height: 16,
          					top: 4,
          					position: "absolute"
        				},
        				rectangleContainer: {
          					left: 131,
          					width: 197
        				},
        				yearEstablishedParent: {
          					top: 38
        				},
        				groupContainer: {
          					top: 42,
          					height: 259,
          					left: 0
        				},
        				companyBiodata: {
          					marginLeft: -75,
          					color: "#6298b9",
          					left: "50%",
          					top: 0
        				},
        				groupParent: {
          					top: 367,
          					left: 30,
          					height: 301
        				},
        				companyBuildProf: {
          					backgroundColor: "#fff",
          					height: 844,
          					overflow: "hidden",
          					width: "100%",
          					flex: 1
        				}
      			});
      			
      			export default CompanyBuildProf;
      			