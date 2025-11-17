// components/ProfileImagePicker.tsx
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import React, { useState, useRef } from 'react';
import { View, Image, StyleSheet, Text, Pressable, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { isWeb } from '../utils/platform';

interface ProfileImagePickerProps {
  onImageSelected?: (file: any) => void;
}

const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({ onImageSelected }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const pickImage = async () => {
    if (isWeb) {
      // Web implementation using file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          const file = target.files[0];
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result === 'string') {
              setImageUri(result);
              // Pass file to parent component
              onImageSelected?.({
                uri: result,
                name: file.name,
                type: file.type,
                size: file.size,
              });
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      // Mobile implementation
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission required", "Please allow access to your photo library.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // square crop
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        // Pass file to parent component
        onImageSelected?.({
          uri: asset.uri,
          name: asset.fileName || 'image.jpg',
          type: asset.type || 'image/jpeg',
          size: asset.fileSize || 0,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="person-circle-outline" size={80} color="#aaa" />
            <Text style={styles.placeholderText}>Upload Photo</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default ProfileImagePicker;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: hp(2),
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 5,
    fontSize: 12,
    color: '#777',
  },
});
