import * as React from "react";
import {StyleSheet, View, Text, Image, Pressable} from "react-native";
import Group12 from '../../assets/SVGs/student_buildprofile_group12.svg'; // adjust the path as needed
import Rectangle9 from "../../assets/SVGs/student_buildprofile_Rectangle 9.svg"
import BlueRectangle from "../../assets/SVGs/student_buildprofile_bluerectangle.svg"
import Group8 from "../../assets/SVGs/student_buildprofile_Group 8.svg"

const StudBuildProf = () => {
  	
  	return (
    		<View style={styles.studBuildProf1}>
      			<View style={styles.studBuildProf1Child} />
      			<Text style={styles.whoAreYou}>WHO ARE YOU?</Text>
        				<View style={[styles.rectangleParent, styles.timeFlexBox]}>
							<BlueRectangle style={styles.frameLayout} width={96} height={10} />
							<Rectangle9 style={styles.frameLayout} width={96} height={10} />
          					<Rectangle9 style={styles.frameLayout} width={96} height={10} />
        				</View>
        				<Text style={[styles.middleName, styles.nameTypo]}>Middle Name</Text>
        				<View style={[styles.givenNameParent, styles.nameParentLayout]}>
          					<Text style={[styles.givenName, styles.namePosition]}>Given Name</Text>
          					<View style={[styles.groupChild, styles.groupChildLayout]} />
        				</View>
        				<View style={[styles.lastNameParent, styles.nameParentLayout]}>
          					<Text style={[styles.lastName, styles.lastNameTypo]}>Last Name</Text>
          					<View style={[styles.groupChild, styles.groupChildLayout]} />
        				</View>
        				<View style={[styles.rectangleGroup, styles.nameParentLayout]}>
          					<View style={[styles.groupChild, styles.groupChildLayout]} />
          					<Text style={[styles.nationality, styles.ageTypo]}>Nationality</Text>
        				</View>
        				<View style={[styles.studBuildProf1Item, styles.studPosition]} />
        				<View style={[styles.studBuildProf1Inner, styles.studPosition]} />
        				<Text style={[styles.age, styles.ageTypo]}>Age</Text>
        				<View style={[styles.rectangleContainer, styles.studPosition]}>
          					<View style={[styles.rectangleView, styles.groupChildLayout]} />
          					<Text style={styles.optionalIf}>(optional / if any)</Text>
        				</View>
                        <Pressable style={styles.wrapper} onPress={() => {}}>
                            <Group12 width={100} height={100} style={styles.icon} />
                        </Pressable>
        				<View style={styles.educationParent}>
          					<Text style={[styles.education, styles.ageTypo]}>EDUCATION</Text>
          					<View style={[styles.groupView, styles.groupViewPosition]}>
            						<View style={[styles.groupChild1, styles.groupChildLayout]} />
            						<Text style={[styles.graduationYear, styles.graduationYearTypo]}>Graduation Year</Text>
          					</View>
          					<View style={[styles.rectangleParent1, styles.groupViewPosition]}>
            						<View style={[styles.groupChild, styles.groupChildLayout]} />
            						<Text style={[styles.majorChosen, styles.lastNameTypo]}>Major Chosen</Text>
          					</View>
          					<Text style={[styles.year, styles.yearLayout]}>Year</Text>
          					<Text style={[styles.majorName, styles.yearLayout]}>Major Name</Text>
        				</View>
        				<Text style={[styles.language, styles.lastNameTypo]}>Language</Text>
        				<View style={[styles.rectangleParent2, styles.groupChild3Layout]}>
          					<View style={[styles.groupChild3, styles.groupChild3Layout]} />
          					<Text style={[styles.connectLinkedin, styles.graduationYearTypo]}>Connect Linkedin</Text>
        				</View>
        				<View style={[styles.lineView, styles.lineViewBorder]} />
        				<View style={[styles.studBuildProf1Child1, styles.lineViewBorder]} />
        				<Text style={[styles.profilePicture, styles.lastNameTypo]}>Profile Picture</Text>
        				<Group8 style={styles.groupIcon} width={65} height={54} />
        				</View>);
      			};
      			
      			const styles = StyleSheet.create({
        				educationPosition: {
          					top: 0,
          					left: 0
        				},
        				timeFlexBox: {
          					justifyContent: "center",
          					flexDirection: "row"
        				},
        				capIconPosition: {
          					left: "50%",
          					position: "absolute"
        				},
        				frameLayout: {
          					borderRadius: 5
        				},
        				nameTypo: {
          					fontSize: 16,
          					fontFamily: "Inter-Regular",
          					textAlign: "center",
          					color: "#000",
          					lineHeight: 22,
          					position: "absolute"
        				},
        				nameParentLayout: {
          					height: 28,
          					width: 328,
          					left: 31,
          					position: "absolute"
        				},
        				namePosition: {
          					top: 3,
          					left: 0
        				},
        				groupChildLayout: {
          					width: 212,
          					backgroundColor: "rgba(217, 217, 217, 0.5)",
          					height: 28,
          					borderRadius: 5,
          					top: 0,
          					position: "absolute"
        				},
        				lastNameTypo: {
          					fontSize: 15,
          					fontFamily: "Inter-Regular",
          					textAlign: "center",
          					color: "#000",
          					lineHeight: 22,
          					position: "absolute"
        				},
        				ageTypo: {
          					lineHeight: 15,
          					fontSize: 15,
          					fontFamily: "Inter-Regular",
          					textAlign: "center",
          					position: "absolute"
        				},
        				studPosition: {
          					left: 147,
          					width: 212,
          					height: 28,
          					position: "absolute"
        				},
        				groupViewPosition: {
          					left: 1,
          					height: 28,
          					position: "absolute"
        				},
        				graduationYearTypo: {
          					top: 4,
          					fontSize: 15,
          					fontFamily: "Inter-Regular",
          					textAlign: "center",
          					lineHeight: 22,
          					position: "absolute"
        				},
        				yearLayout: {
          					width: 164,
          					height: 16,
          					color: "#8f8b8b",
          					fontSize: 12,
          					fontFamily: "Inter-Regular",
          					textAlign: "center",
          					lineHeight: 22,
          					position: "absolute"
        				},
        				groupChild3Layout: {
          					height: 30,
          					width: 156,
          					position: "absolute"
        				},
        				lineViewBorder: {
          					borderColor: "#fff",
          					borderStyle: "solid",
          					position: "absolute"
        				},
        				studBuildProf1Child: {
          					top: 186,
          					height: 108,
          					width: 99,
          					backgroundColor: "#d9d9d9",
          					left: 31,
          					position: "absolute"
        				},
        				time1: {
          					fontWeight: "600",
          					fontFamily: "SF Pro",
          					textAlign: "center",
          					lineHeight: 22,
          					fontSize: 17,
          					color: "#000"
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
          					position: "absolute"
        				},
        				whoAreYou: {
          					marginLeft: -163,
          					top: 154,
          					height: 32,
          					width: 328,
          					color: "#7da0ca",
          					fontFamily: "Inter-Regular",
          					left: "50%",
          					textAlign: "center",
          					lineHeight: 22,
          					fontSize: 17,
          					position: "absolute"
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
        				middleName: {
          					top: 415,
          					left: 31
        				},
        				givenName: {
          					width: 93,
          					fontSize: 16,
          					fontFamily: "Inter-Regular",
          					textAlign: "center",
          					color: "#000",
          					lineHeight: 22,
          					position: "absolute"
        				},
        				groupChild: {
          					left: 116
        				},
        				givenNameParent: {
          					top: 373
        				},
        				lastName: {
          					top: 3,
          					left: 0
        				},
        				lastNameParent: {
          					top: 449
        				},
        				nationality: {
          					top: 7,
          					color: "#000",
          					left: 0
        				},
        				rectangleGroup: {
          					top: 487
        				},
        				studBuildProf1Item: {
          					top: 525,
          					backgroundColor: "rgba(217, 217, 217, 0.5)",
          					left: 147,
          					borderRadius: 5
        				},
        				studBuildProf1Inner: {
          					top: 563,
          					backgroundColor: "rgba(217, 217, 217, 0.5)",
          					left: 147,
          					borderRadius: 5
        				},
        				age: {
          					top: 532,
          					color: "#000",
          					left: 31
        				},
        				rectangleView: {
          					left: 0
        				},
        				optionalIf: {
          					left: 58,
          					height: 16,
          					color: "#8f8b8b",
          					fontSize: 12,
          					top: 4,
          					width: 96,
          					fontFamily: "Inter-Regular",
          					textAlign: "center",
          					lineHeight: 22,
          					position: "absolute"
        				},
        				rectangleContainer: {
          					top: 411
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
        				education: {
          					color: "#7da0ca",
          					left: 0,
          					top: 0
        				},
        				groupChild1: {
          					left: 115
        				},
        				graduationYear: {
          					color: "#000",
          					left: 0
        				},
        				groupView: {
          					top: 25,
          					width: 327
        				},
        				majorChosen: {
          					top: 3,
          					left: 0,
          					width: 99
        				},
        				rectangleParent1: {
          					top: 63,
          					width: 328
        				},
        				year: {
          					top: 29,
          					left: 140
        				},
        				majorName: {
          					top: 67,
          					left: 143
        				},
        				educationParent: {
          					top: 606,
          					width: 329,
          					height: 91,
          					left: 31,
          					position: "absolute"
        				},
        				language: {
          					top: 566,
          					left: 31
        				},
        				groupChild3: {
          					borderRadius: 10,
          					left: 0,
          					top: 0,
          					backgroundColor: "#d9d9d9"
        				},
        				connectLinkedin: {
          					left: 14,
          					color: "#fff",
          					width: 127
        				},
        				rectangleParent2: {
          					top: 220,
          					left: 202
        				},
        				lineView: {
          					top: 214,
          					left: 78,
          					borderRightWidth: 2,
          					width: 2,
          					height: 52
        				},
        				studBuildProf1Child1: {
          					top: 239,
          					left: 55,
          					borderTopWidth: 2,
          					width: 52,
          					height: 2
        				},
        				profilePicture: {
          					top: 297,
          					left: 31
        				},
        				groupIcon: {
          					top: 50,
          					left: 162,
          					position: "absolute"
        				},
        				studBuildProf1: {
          					backgroundColor: "#fff",
          					height: 844,
          					overflow: "hidden",
          					width: "100%",
          					flex: 1
        				}
      			});
      			
      			export default StudBuildProf;
      			