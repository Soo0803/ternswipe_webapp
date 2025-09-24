import * as React from "react";
import {Text, StyleSheet, View, Image, Pressable} from "react-native";
import Group14 from '../../assets/SVGs/log_in_page_group14.svg' // Adjust path based on actual location
import Group13 from "../../assets/SVGs/log_in_page_group13.svg"
import Rectangle5 from "../../assets/SVGs/log_in_page_rectangle5.svg"
import Group8 from "../../assets/SVGs/log_in_page_group8.svg"

const LogInPage = () => {
  	
  	return (
    		<View style={styles.logInPage}>
      			<Text style={[styles.password, styles.passwordTypo]}>Password</Text>
      			<View style={[styles.phoneNoEmailParent, styles.parentLayout]}>
        				<Text style={[styles.phoneNoEmail, styles.phoneNoEmailPosition]}>Phone no. /Email</Text>
        				<View style={[styles.groupChild, styles.childBorder]} />
      			</View>
      			<View style={[styles.logInPageChild, styles.childBorder]} />
      			<Text style={[styles.forgotPasswordReset, styles.forgotTypo]}>forgot password? reset here</Text>
        				<Text style={[styles.forgotUsernameRetrieve, styles.forgotTypo]}>forgot username? retrieve here</Text>
          					<Group13 style={[styles.logInPageItem, styles.itemPosition]} width={328} height={24} />
                            <Pressable style={[styles.wrapper, styles.itemPosition]} onPress={()=>{}}>
                                <Group14 width={100} height={100} style={styles.icon} />
                            </Pressable>
                            <Pressable style={[styles.loginButton, styles.itemPosition]} onPress={() => {}}>
                                <Text style={[styles.logIn, styles.logInTypo]}>LOG IN</Text>
                            </Pressable>
                            <Text style={[styles.logIn, styles.logInTypo]}>LOG IN</Text>
                            <Text style={[styles.newRegisterFor, styles.logInTypo]}>NEW REGISTER FOR STUDENT</Text>
                            <Pressable style={[styles.vectorParent, styles.itemPosition]} onPress={()=>{}}>
                                <Rectangle5 style={[styles.groupItem, styles.itemPosition]} width={328} height={24} />
                                <Text style={[styles.newRegisterFor1, styles.newLayout]}>NEW REGISTER FOR COMPANY</Text>
                            </Pressable>        
          					<Group8 style={styles.logInPageInner} width={65} height={54} />
          		</View>);
        				};
        				
        				const styles = StyleSheet.create({
          					passwordTypo: {
            						height: 22,
            						textAlign: "left",
            						fontFamily: "Inter-Regular",
            						fontSize: 12,
            						color: "#000"
          					},
          					parentLayout: {
            						height: 24,
            						width: 328
          					},
          					phoneNoEmailPosition: {
            						left: 0,
            						position: "absolute"
          					},
          					childBorder: {
            						height: 20,
            						borderWidth: 0.5,
            						borderColor: "#000",
            						borderStyle: "solid",
            						borderRadius: 5,
            						position: "absolute"
          					},
          					forgotTypo: {
            						width: 149,
            						color: "#7da0ca",
            						// textDecoration: "underline",
            						top: 392,
            						height: 13,
            						fontSize: 10,
            						textAlign: "left",
            						fontFamily: "Inter-Regular",
            						position: "absolute"
          					},
          					itemPosition: {
            						left: "50%",
            						position: "absolute"
          					},
          					logInTypo: {
            						height: 18,
            						left: "50%",
            						fontSize: 10,
            						textAlign: "left",
            						color: "#000",
            						fontFamily: "Inter-Regular",
            						position: "absolute"
          					},
          					newLayout: {
            						width: 151,
            						marginLeft: -75
          					},
          					timeFlexBox: {
            						justifyContent: "center",
            						alignItems: "center"
          					},
          					password: {
            						left: 51,
            						width: 62,
            						top: 363,
            						position: "absolute"
          					},
          					phoneNoEmail: {
            						top: 2,
            						width: 95,
            						height: 22,
            						textAlign: "left",
            						fontFamily: "Inter-Regular",
            						fontSize: 12,
            						color: "#000"
          					},
          					groupChild: {
            						left: 101,
            						width: 227,
            						top: 0
          					},
          					phoneNoEmailParent: {
            						top: 334,
            						left: 31,
            						position: "absolute"
          					},
          					logInPageChild: {
            						left: 133,
            						width: 226,
            						top: 363
          					},
          					forgotPasswordReset: {
            						height: 13,
            						left: 31
          					},
          					forgotUsernameRetrieve: {
            						left: 210,
            						height: 13
          					},
          					logInPageItem: {
            						top: 443,
            						marginLeft: -164
          					},
          					icon: {
            						// nodeWidth: 328,
            						// nodeHeight: 24,
            						height: "100%",
            						marginLeft: -164,
            						width: "100%"
          					},
          					wrapper: {
            						top: 412,
            						height: 24,
            						width: 328
          					},
          					newRegisterFor: {
            						top: 449,
            						width: 151,
            						marginLeft: -75
          					},
          					logIn: {
            						marginLeft: -18,
            						top: 418,
            						width: 37
          					},
          					groupItem: {
            						marginLeft: -164,
            						borderRadius: 5,
            						left: "50%",
            						top: 0
          					},
          					newRegisterFor1: {
            						top: 5,
            						height: 19,
            						left: "50%",
            						position: "absolute",
            						fontSize: 10,
            						width: 151,
            						marginLeft: -75,
            						textAlign: "left",
            						color: "#000",
            						fontFamily: "Inter-Regular"
          					},
                            loginButton: {
                                top: 412,
                                marginLeft:-164,
                                height: 24,
                                width: 328,
                                backgroundColor: '#C1E8FF',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 5
                            },
          					vectorParent: {
            						top: 475,
            						marginLeft: -164,
            						height: 24,
            						width: 328
          					},
          					logInPageInner: {
            						top: 224,
            						left: 162,
            						position: "absolute"
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
          					cellularConnectionIcon: {},
          					wifiIcon: {},
          					border: {
            						marginLeft: -13.65,
            						top: "0%",
            						bottom: "0%",
            						borderRadius: 4,
            						borderWidth: 1,
            						width: 25,
            						opacity: 0.35,
            						height: "100%",
            						borderColor: "#000",
            						borderStyle: "solid",
            						left: "50%"
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
          					statusBarIphone: {
            						width: 390,
            						height: 50,
            						paddingTop: 21,
            						top: 0
          					},
          					logInPage: {
            						shadowColor: "rgba(0, 0, 0, 0.25)",
            						shadowOffset: {
              							width: 0,
              							height: 4
            						},
            						shadowRadius: 4,
            						elevation: 4,
            						shadowOpacity: 1,
            						backgroundColor: "#fff",
            						height: 844,
            						overflow: "hidden",
            						width: "100%",
            						flex: 1
          					}
        				});
        				
        				export default LogInPage;
        				