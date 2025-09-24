import { 
  View, 
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';

import { TextInput } from 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import AntDesign from "@expo/vector-icons/AntDesign";
import UploadFileButton from '../../component/UploadFileButton';
import { useCompanyForm } from '../../context/companyFormContext';

// Import components and assets
import AppLogo from "../../assets/app_icon/in_app_logo.svg";
import ProgressBar from "../../component/ProgressBar";

export default function index() {
const router = useRouter();
const { formData, setFormData } = useCompanyForm();

return (
  <SafeAreaView style={styles.page}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={hp(3)}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(10) }} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <AppLogo />
          <ProgressBar process={0.65} />
          <Text style={[styles.text, { paddingTop: hp(1), paddingBottom: hp(1), color: "#A5CBE1" }]}>YOUR RELEVANCE</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.title_text}>Lab Images</Text>

          <Text style={[styles.text, { paddingTop: hp(2) }]}>Your Research Team Image (Optional)</Text>
          <UploadFileButton onFileSelected={(file: File) => setFormData({ ...formData, team_image: file })} />

          <Text style={[styles.text, { paddingTop: hp(2) }]}>Lab/Office (First Image)</Text>
          <UploadFileButton onFileSelected={(file: File) => setFormData({ ...formData, lab_first_image: file })} />

          <Text style={[styles.text, { paddingTop: hp(2) }]}>Lab/Office (Second Image)</Text>
          <UploadFileButton onFileSelected={(file: File) => setFormData({ ...formData, lab_second_image: file })} />

          <Text style={[styles.text, { paddingTop: hp(2) }]}>Lab/Office (Third Image)</Text>
          <UploadFileButton onFileSelected={(file: File) => setFormData({ ...formData, lab_third_image: file })} />

          {/* Dynamic Research Projects */}
          {(() => {
            const projects = formData.projects && formData.projects.length > 0 ? formData.projects : [{ title: '', description: '' } as any];
            return projects.map((proj, idx) => (
              <View key={idx} style={{ width: '100%', marginBottom: hp(2) }}>
                <Text style={styles.title_text}>{`Add Research Project ${idx + 1}`}</Text>

                <View style={styles.input_form_wrap}>
                  <Text style={styles.text}>Project Title</Text>
                  <TextInput
                    placeholder="e.g., ML for Medical Imaging"
                    style={styles.input_text}
                    keyboardType="default"
                    value={formData.projects[idx]?.title || ''}
                    onChangeText={(text) => {
                      const next = [...(formData.projects || [])];
                      if (!next[idx]) next[idx] = { title: '', description: '' } as any;
                      next[idx].title = text;
                      setFormData({ ...formData, projects: next });
                    }}
                  />
                </View>

                <View style={styles.input_form_wrap}>
                  <Text style={styles.text}>Project Description</Text>
                  <TextInput
                    placeholder="Describe the project"
                    style={styles.input_text}
                    keyboardType="default"
                    value={formData.projects[idx]?.description || ''}
                    onChangeText={(text) => {
                      const next = [...(formData.projects || [])];
                      if (!next[idx]) next[idx] = { title: '', description: '' } as any;
                      next[idx].description = text;
                      setFormData({ ...formData, projects: next });
                    }}
                  />
                </View>

                <View style={styles.input_form_wrap}>
                  <Text style={styles.text}>Modality</Text>
                  <TextInput
                    placeholder="Remote / On-site / Hybrid"
                    style={styles.input_text}
                    keyboardType="default"
                    value={formData.projects[idx]?.modality || ''}
                    onChangeText={(text) => {
                      const next = [...(formData.projects || [])];
                      if (!next[idx]) next[idx] = { title: '', description: '' } as any;
                      next[idx].modality = text as any;
                      setFormData({ ...formData, projects: next });
                    }}
                  />
                </View>

          <View style={styles.input_form_wrap}>
                  <Text style={styles.text}>Project Location</Text>
            <TextInput
                    placeholder="e.g., Xuhui, Shanghai"
              style={styles.input_text}
              keyboardType="default"
                    value={formData.projects[idx]?.location || ''}
                    onChangeText={(text) => {
                      const next = [...(formData.projects || [])];
                      if (!next[idx]) next[idx] = { title: '', description: '' } as any;
                      next[idx].location = text as any;
                      setFormData({ ...formData, projects: next });
                    }}
                  />
                </View>
              </View>
            ));
          })()}

          <View style={{ width: '100%', alignItems: 'flex-end', marginTop: hp(1) }}>
            <Pressable
              onPress={() => {
                const curr = formData.projects || [];
                if (curr.length >= 5) return; // max 5
                const next = [...curr, { title: '', description: '' } as any];
                setFormData({ ...formData, projects: next });
              }}
              disabled={(formData.projects || []).length >= 5}
              style={[{ flexDirection: 'row', alignItems: 'center', gap: 5 }, { opacity: (formData.projects || []).length >= 5 ? 0.5 : 1 }]}
            >
              <Text style={{ textDecorationLine: 'underline', color: '#7da0ca', fontSize: 12, fontFamily: 'Inter-Regular' }}>
                {(formData.projects || []).length >= 5 ? 'Max 5 projects reached' : 'Add more project'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Pressable onPress={() => router.push("/(company_sign_up)")}>
            <AntDesign name="leftcircleo" size={hp(5)} color="#A5CBE1" />
          </Pressable>
          <Pressable onPress={() => router.push("/(company_sign_up)/page_3")}>
            <AntDesign name="rightcircleo" size={hp(5)} color="#A5CBE1" />
          </Pressable>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create ({
page:{
  flex: 1,
  backgroundColor: "#fff",
  height: "100%",
},

header:{
  paddingTop: hp(3),
  flex: 0.6,
  alignItems: "center",
},

body:{
  flex:2,
  paddingTop: hp(2),
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
},

footer:{
  flexDirection: "row",
  justifyContent: "space-between",
  flex:0.5,
  paddingTop: hp(3),
},

text: {
  fontFamily: "Inter-Regular",
},

input_form_wrap:{
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: hp(1),
},

input_text:{
  backgroundColor: "f2f2f2",
  borderRadius: 5,
  width: wp(50),
  height: hp(5),
  fontFamily: "Inter-Regular",
  alignItems: "center",
  textAlign: "left",
  paddingVertical: 0,
  paddingHorizontal: 10,
  borderWidth: 1,
},

company_description:{
  width:"100%",
  textAlign: "left",
  fontFamily: "Inter-Regular",
  paddingTop: hp(2),
},

input_text_company_description:{
  backgroundColor: "#f2f2f2",
  borderRadius: 5,
  width: "100%",
  height: hp(20),
  fontFamily: "Inter-Regular",
  alignItems: "center",
  textAlign: "left",
},

title_text:{
  fontFamily: "Inter-Regular",
  fontSize: hp(2.5),
  textAlign: "left",
  paddingTop: hp(2),
},

input_image_wrap:{
  backgroundColor: "#f2f2f2",
  borderRadius: 5,
},

input_text_image:{
  backgroundColor: "#f2f2f2",
  borderRadius: 5,
  width: "100%",
  height: hp(20),
  fontFamily: "Inter-Regular",
  alignItems: "center",
  textAlign: "left",
},


});