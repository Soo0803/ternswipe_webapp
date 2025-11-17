import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { isWeb } from '../utils/platform';

import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { palette, radii } from '../constants/theme';

interface UploadFileButtonProps {
  onFileSelected?: (file: any) => void;
  label?: string;
}

export default function UploadFileButton({ onFileSelected, label = 'Upload PDF' }: UploadFileButtonProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = async () => {
    try {
      if (isWeb) {
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
          }
        };
        input.click();
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          type: 'application/pdf',
          copyToCacheDirectory: true,
          multiple: false,
        });

        if (result.assets && result.assets.length > 0) {
          const file = result.assets[0];
          setFileName(file.name);

          onFileSelected?.({
            uri: file.uri,
            name: file.name,
            type: file.mimeType || 'application/pdf',
          });
        }
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.uploadButton} onPress={handleFileUpload}>
        <Ionicons name="cloud-upload-outline" size={24} color={palette.primary} />
        <Text style={styles.uploadText}>{label}</Text>
      </Pressable>
      {fileName && <Text style={styles.fileName}>Uploaded: {fileName}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'flex-start',
    gap: 12,
  },
  uploadButton: {
    width: '100%',
    minHeight: hp(12),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: palette.surfaceMuted,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8,
  },
  uploadText: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '600',
  },
  fileName: {
    fontSize: 13,
    color: palette.textSubtle,
  },
});