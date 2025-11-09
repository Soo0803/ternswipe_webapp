import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { isWeb } from '../utils/platform';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function UploadButton({ onFileSelected }: { onFileSelected?: (file: any) => void }) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = async () => {
    try {
      if (isWeb) {
        // Web implementation using file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf';
        input.onchange = (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (target.files && target.files[0]) {
            const file = target.files[0];
            setFileName(file.name);
            
            const reader = new FileReader();
            reader.onload = (event) => {
              const result = event.target?.result;
              if (result) {
                // Convert to data URI for web
                const dataUri = typeof result === 'string' ? result : URL.createObjectURL(file);
                onFileSelected?.({
                  uri: dataUri,
                  name: file.name,
                  type: file.type || 'application/pdf',
                  size: file.size,
                });
              }
            };
            reader.readAsDataURL(file);
            
            console.log("File Name:", file.name);
            console.log("File MIME type:", file.type);
            console.log("File Size:", file.size);
          }
        };
        input.click();
      } else {
        // Mobile implementation
        const result = await DocumentPicker.getDocumentAsync({
          type: 'application/pdf',
          copyToCacheDirectory: true,
          multiple: false,
        });

        if (result.assets && result.assets.length > 0) {
          const file = result.assets[0];
          setFileName(file.name);

          // ✅ Send file back to parent
          onFileSelected?.({
            uri: file.uri,
            name: file.name,
            type: file.mimeType || 'application/pdf',
          });

          console.log("File URI:", file.uri);
          console.log("File Name:", file.name);
          console.log("File MIME type:", file.mimeType);
        }
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.uploadButton} onPress={handleFileUpload}>
        <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
        <Text style={styles.uploadText}>Upload PDF</Text>
      </Pressable>
      {fileName && <Text style={styles.fileName}>Uploaded: {fileName}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  uploadButton: {
    height: hp(15),
    width: wp(38),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  fileName: {
    marginTop: 15,
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
});